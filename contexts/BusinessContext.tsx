import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";

import {
  BusinessProfile,
  BusinessSurvey,
  CreditPackage,
  PaymentTransaction,
  SurveyStatistics,
  SurveyStatus,
} from "@/types";

interface BusinessState {
  business: BusinessProfile | null;
  surveys: BusinessSurvey[];
  statistics: { [surveyId: string]: SurveyStatistics };
  transactions: PaymentTransaction[];
  creditPackages: CreditPackage[];
  isLoading: boolean;
  createSurvey: (survey: Omit<BusinessSurvey, "id" | "createdAt" | "businessId">) => Promise<string>;
  updateSurvey: (surveyId: string, updates: Partial<BusinessSurvey>) => void;
  deleteSurvey: (surveyId: string) => void;
  getSurveyById: (surveyId: string) => BusinessSurvey | undefined;
  purchaseCredits: (packageId: string, method: "airtel" | "mobicash" | "card") => Promise<void>;
  getSurveyStatistics: (surveyId: string) => SurveyStatistics | undefined;
  updateBusiness: (updates: Partial<BusinessProfile>) => void;
  logout: () => Promise<void>;
}

const mockCreditPackages: CreditPackage[] = [
  {
    id: "pkg_1",
    name: "Starter",
    credits: 100,
    price: 50000,
    currency: "GNF",
    description: "Parfait pour débuter",
  },
  {
    id: "pkg_2",
    name: "Professional",
    credits: 500,
    price: 200000,
    currency: "GNF",
    description: "Pour les entreprises en croissance",
    popular: true,
  },
  {
    id: "pkg_3",
    name: "Enterprise",
    credits: 2000,
    price: 750000,
    currency: "GNF",
    description: "Pour les grandes organisations",
  },
];

export const [BusinessProvider, useBusiness] = createContextHook<BusinessState>(() => {
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [statistics, setStatistics] = useState<{ [surveyId: string]: SurveyStatistics }>({});
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [creditPackages] = useState<CreditPackage[]>(mockCreditPackages);
  const [isLoading, setIsLoading] = useState(true);

  const businessSurveysQuery = trpc.business.getSurveys.useQuery(
    { businessId: business?.id ?? "" },
    { enabled: !!business?.id }
  );
  const createSurveyMutation = trpc.surveys.create.useMutation();
  const deleteSurveyMutation = trpc.surveys.delete.useMutation();
  const addCreditsMutation = trpc.business.addCredits.useMutation();

  const surveys = useMemo(() => {
    if (!businessSurveysQuery.data) return [];
    return businessSurveysQuery.data.map((s) => ({
      ...s,
      endsAt: s.endsAt ?? undefined,
      imageUrl: s.imageUrl ?? undefined,
      scheduledStart: s.scheduledStart ?? undefined,
      accessLink: s.accessLink ?? undefined,
      targeting: undefined,
    })) as BusinessSurvey[];
  }, [businessSurveysQuery.data]);

  const loadBusinessData = useCallback(async () => {
    try {
      const [businessData, , statsData, transactionsData] = await Promise.all([
        AsyncStorage.getItem("business_profile"),
        AsyncStorage.getItem("business_surveys"),
        AsyncStorage.getItem("business_statistics"),
        AsyncStorage.getItem("business_transactions"),
      ]);

      if (businessData) {
        const parsed = JSON.parse(businessData);
        setBusiness({
          ...parsed,
          joinedAt: new Date(parsed.joinedAt),
        });
      }



      if (statsData) {
        setStatistics(JSON.parse(statsData));
      }

      if (transactionsData) {
        const parsed = JSON.parse(transactionsData);
        setTransactions(
          parsed.map((t: PaymentTransaction) => ({
            ...t,
            createdAt: new Date(t.createdAt),
            completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
          }))
        );
      }
    } catch (error) {
      console.error("Error loading business data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBusinessData();
  }, [loadBusinessData]);



  const saveBusiness = useCallback(async (updatedBusiness: BusinessProfile) => {
    try {
      await AsyncStorage.setItem("business_profile", JSON.stringify(updatedBusiness));
    } catch (error) {
      console.error("Error saving business:", error);
    }
  }, []);

  const createSurvey = useCallback(
    async (survey: Omit<BusinessSurvey, "id" | "createdAt" | "businessId">) => {
      if (!business) throw new Error("No business profile found");

      try {
        const result = await createSurveyMutation.mutateAsync({
          title: survey.title,
          description: survey.description,
          category: survey.category,
          creatorType: survey.creatorType,
          creatorName: survey.creatorName,
          isPublic: survey.isPublic,
          endsAt: survey.endsAt,
          imageUrl: survey.imageUrl,
          businessId: business.id,
          questions: survey.questions,
        });

        const updatedBusiness = {
          ...business,
          surveysCreated: business.surveysCreated + 1,
          credits: business.credits - survey.costCredits,
        };
        setBusiness(updatedBusiness);
        await saveBusiness(updatedBusiness);

        await businessSurveysQuery.refetch();

        return result.id;
      } catch (error) {
        console.error("Error creating survey:", error);
        throw error;
      }
    },
    [business, createSurveyMutation, saveBusiness, businessSurveysQuery]
  );

  const updateSurvey = useCallback(
    async (surveyId: string, updates: Partial<BusinessSurvey>) => {
      console.log("Update survey not implemented yet", surveyId, updates);
      await businessSurveysQuery.refetch();
    },
    [businessSurveysQuery]
  );

  const deleteSurvey = useCallback(
    async (surveyId: string) => {
      try {
        await deleteSurveyMutation.mutateAsync({ id: surveyId });
        await businessSurveysQuery.refetch();
      } catch (error) {
        console.error("Error deleting survey:", error);
        throw error;
      }
    },
    [deleteSurveyMutation, businessSurveysQuery]
  );

  const getSurveyById = useCallback(
    (surveyId: string) => {
      return surveys.find((s) => s.id === surveyId);
    },
    [surveys]
  );

  const purchaseCredits = useCallback(
    async (packageId: string, method: "airtel" | "mobicash" | "card") => {
      if (!business) throw new Error("No business profile found");

      const pkg = creditPackages.find((p) => p.id === packageId);
      if (!pkg) throw new Error("Package not found");

      try {
        await addCreditsMutation.mutateAsync({
          businessId: business.id,
          amount: pkg.price,
          credits: pkg.credits,
          method,
        });

        const transaction: PaymentTransaction = {
          id: `tx_${Date.now()}`,
          businessId: business.id,
          amount: pkg.price,
          credits: pkg.credits,
          method,
          status: "completed",
          createdAt: new Date(),
          completedAt: new Date(),
        };

        const updatedTransactions = [...transactions, transaction];
        setTransactions(updatedTransactions);

        const updatedBusiness = {
          ...business,
          credits: business.credits + pkg.credits,
        };
        setBusiness(updatedBusiness);

        await AsyncStorage.setItem("business_transactions", JSON.stringify(updatedTransactions));
        await saveBusiness(updatedBusiness);
      } catch (error) {
        console.error("Error purchasing credits:", error);
        throw error;
      }
    },
    [business, creditPackages, transactions, addCreditsMutation, saveBusiness]
  );

  const getSurveyStatistics = useCallback(
    (surveyId: string) => {
      return statistics[surveyId];
    },
    [statistics]
  );

  const updateBusiness = useCallback(
    (updates: Partial<BusinessProfile>) => {
      if (!business) return;

      const updatedBusiness = { ...business, ...updates };
      setBusiness(updatedBusiness);
      saveBusiness(updatedBusiness);
    },
    [business, saveBusiness]
  );

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove(["user_authenticated", "user_type"]);
      console.log("Business user logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }, []);

  return useMemo(
    () => ({
      business,
      surveys,
      statistics,
      transactions,
      creditPackages,
      isLoading,
      createSurvey,
      updateSurvey,
      deleteSurvey,
      getSurveyById,
      purchaseCredits,
      getSurveyStatistics,
      updateBusiness,
      logout,
    }),
    [
      business,
      surveys,
      statistics,
      transactions,
      creditPackages,
      isLoading,
      createSurvey,
      updateSurvey,
      deleteSurvey,
      getSurveyById,
      purchaseCredits,
      getSurveyStatistics,
      updateBusiness,
      logout,
    ]
  );
});

export const useActiveSurveys = () => {
  const { surveys } = useBusiness();
  return useMemo(
    () => surveys.filter((s) => s.status === "active"),
    [surveys]
  );
};

export const useSurveysByStatus = (status: SurveyStatus) => {
  const { surveys } = useBusiness();
  return useMemo(
    () => surveys.filter((s) => s.status === status),
    [surveys, status]
  );
};
