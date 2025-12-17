import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { mockUser } from "@/mocks/surveys";
import { Answer, Category, CompletedSurvey, Survey, UserProfile } from "@/types";

interface AppState {
  user: UserProfile;
  surveys: Survey[];
  completedSurveys: CompletedSurvey[];
  completeSurvey: (surveyId: string, answers: Answer[]) => void;
  getSurveyById: (surveyId: string) => Survey | undefined;
  hasCompletedSurvey: (surveyId: string) => boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

export const [AppProvider, useApp] = createContextHook<AppState>(() => {
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [completedSurveys, setCompletedSurveys] = useState<CompletedSurvey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Configuration pour gérer les erreurs gracieusement
  // Le backend tRPC Rork est instable, donc on désactive les retries automatiques
  const surveysQuery = trpc.surveys.list.useQuery(undefined, {
    retry: false, // Ne pas réessayer automatiquement
    refetchOnWindowFocus: false, // Ne pas refetch au focus
    refetchOnReconnect: false, // Ne pas refetch à la reconnexion
  });
  
  // Logger les erreurs sans crasher
  useEffect(() => {
    if (surveysQuery.error) {
      console.warn("Erreur lors du chargement des sondages:", surveysQuery.error.message);
    }
  }, [surveysQuery.error]);
  
  const submitAnswersMutation = trpc.surveys.submitAnswers.useMutation({
    retry: false,
  });

  const surveys = useMemo(() => {
    // Si le backend n'est pas disponible, retourner un tableau vide
    // Les données seront chargées depuis AsyncStorage ou seront vides
    if (!surveysQuery.data) return [];
    return surveysQuery.data.map((s) => ({
      ...s,
      endsAt: s.endsAt ?? undefined,
      imageUrl: s.imageUrl ?? undefined,
    }));
  }, [surveysQuery.data]);

  const loadCompletedSurveys = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("completed_surveys");
      if (stored) {
        const parsed = JSON.parse(stored);
        setCompletedSurveys(parsed);
      }
    } catch (error) {
      console.error("Error loading completed surveys:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompletedSurveys();
  }, [loadCompletedSurveys]);

  const saveCompletedSurveys = useCallback(async (completed: CompletedSurvey[]) => {
    try {
      await AsyncStorage.setItem("completed_surveys", JSON.stringify(completed));
    } catch (error) {
      console.error("Error saving completed surveys:", error);
    }
  }, []);

  const completeSurvey = useCallback(async (surveyId: string, answers: Answer[]) => {
    const newCompleted: CompletedSurvey = {
      surveyId,
      completedAt: new Date(),
      answers,
    };

    setCompletedSurveys((prev) => {
      const updated = [...prev, newCompleted];
      saveCompletedSurveys(updated);
      return updated;
    });

    try {
      await submitAnswersMutation.mutateAsync({
        surveyId,
        userId: user.id,
        answers: answers.map((a) => ({
          questionId: a.questionId,
          value: a.value,
        })),
      });

      setUser((prev) => ({
        ...prev,
        surveysCompleted: prev.surveysCompleted + 1,
        points: prev.points + 50,
      }));

      await surveysQuery.refetch();
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  }, [saveCompletedSurveys, submitAnswersMutation, user.id, surveysQuery]);

  const getSurveyById = useCallback((surveyId: string) => {
    return surveys.find((s) => s.id === surveyId);
  }, [surveys]);

  const hasCompletedSurvey = useCallback((surveyId: string) => {
    return completedSurveys.some((cs) => cs.surveyId === surveyId);
  }, [completedSurveys]);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove(["user_authenticated", "user_type", "user_name"]);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }, []);

  return useMemo(() => ({
    user,
    surveys,
    completedSurveys,
    completeSurvey,
    getSurveyById,
    hasCompletedSurvey,
    isLoading,
    logout,
  }), [user, surveys, completedSurveys, completeSurvey, getSurveyById, hasCompletedSurvey, isLoading, logout]);
});

export const useTrendingSurveys = () => {
  const { surveys } = useApp();
  return useMemo(() => surveys.filter((s) => s.isTrending), [surveys]);
};

export const useSurveysByCategory = (category?: Category) => {
  const { surveys } = useApp();
  return useMemo(() => {
    if (!category) return surveys;
    return surveys.filter((s) => s.category === category);
  }, [surveys, category]);
};
