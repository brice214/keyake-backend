import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  AdminActivity,
  AdminStats,
  BusinessProfile,
  BusinessSurvey,
  SuperAdminProfile,
  UserProfile,
} from "@/types";

interface SuperAdminState {
  admin: SuperAdminProfile | null;
  stats: AdminStats;
  businesses: BusinessProfile[];
  participants: UserProfile[];
  allSurveys: BusinessSurvey[];
  isLoading: boolean;
  updateBusiness: (businessId: string, updates: Partial<BusinessProfile>) => Promise<void>;
  deleteBusiness: (businessId: string) => Promise<void>;
  updateParticipant: (participantId: string, updates: Partial<UserProfile>) => Promise<void>;
  deleteParticipant: (participantId: string) => Promise<void>;
  updateSurvey: (surveyId: string, updates: Partial<BusinessSurvey>) => Promise<void>;
  deleteSurvey: (surveyId: string) => Promise<void>;
  adjustBusinessCredits: (businessId: string, amount: number) => Promise<void>;
  createSurvey: (survey: Omit<BusinessSurvey, "id" | "createdAt" | "businessId">) => Promise<string>;
  logout: () => Promise<void>;
}

export const [SuperAdminProvider, useSuperAdmin] = createContextHook<SuperAdminState>(() => {
  const [admin, setAdmin] = useState<SuperAdminProfile | null>(null);
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [participants, setParticipants] = useState<UserProfile[]>([]);
  const [allSurveys, setAllSurveys] = useState<BusinessSurvey[]>([]);
  const [recentActivity, setRecentActivity] = useState<AdminActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAdminData = useCallback(async () => {
    try {
      const [adminData, businessesData, participantsData, surveysData, activityData] = await Promise.all([
        AsyncStorage.getItem("super_admin_profile"),
        AsyncStorage.getItem("all_businesses"),
        AsyncStorage.getItem("all_participants"),
        AsyncStorage.getItem("all_surveys"),
        AsyncStorage.getItem("admin_activity"),
      ]);

      if (adminData) {
        const parsed = JSON.parse(adminData);
        setAdmin({
          ...parsed,
          createdAt: new Date(parsed.createdAt),
        });
      } else {
        const defaultAdmin: SuperAdminProfile = {
          id: "admin_001",
          email: "admin@titafgroupe.com",
          role: "super_admin",
          name: "Super Admin",
          createdAt: new Date(),
        };
        setAdmin(defaultAdmin);
        await AsyncStorage.setItem("super_admin_profile", JSON.stringify(defaultAdmin));
      }

      if (businessesData) {
        const parsed = JSON.parse(businessesData);
        setBusinesses(
          parsed.map((b: BusinessProfile) => ({
            ...b,
            joinedAt: new Date(b.joinedAt),
          }))
        );
      }

      if (participantsData) {
        const parsed = JSON.parse(participantsData);
        setParticipants(
          parsed.map((p: UserProfile) => ({
            ...p,
            joinedAt: new Date(p.joinedAt),
          }))
        );
      }

      if (surveysData) {
        const parsed = JSON.parse(surveysData);
        setAllSurveys(
          parsed.map((s: BusinessSurvey) => ({
            ...s,
            createdAt: new Date(s.createdAt),
            endsAt: s.endsAt ? new Date(s.endsAt) : undefined,
            scheduledStart: s.scheduledStart ? new Date(s.scheduledStart) : undefined,
          }))
        );
      }

      if (activityData) {
        const parsed = JSON.parse(activityData);
        setRecentActivity(
          parsed.map((a: AdminActivity) => ({
            ...a,
            timestamp: new Date(a.timestamp),
          }))
        );
      } else {
        const mockActivity: AdminActivity[] = [];
        setRecentActivity(mockActivity);
        await AsyncStorage.setItem("admin_activity", JSON.stringify(mockActivity));
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const saveBusinesses = useCallback(async (updatedBusinesses: BusinessProfile[]) => {
    try {
      await AsyncStorage.setItem("all_businesses", JSON.stringify(updatedBusinesses));
    } catch (error) {
      console.error("Error saving businesses:", error);
    }
  }, []);

  const saveParticipants = useCallback(async (updatedParticipants: UserProfile[]) => {
    try {
      await AsyncStorage.setItem("all_participants", JSON.stringify(updatedParticipants));
    } catch (error) {
      console.error("Error saving participants:", error);
    }
  }, []);

  const saveSurveys = useCallback(async (updatedSurveys: BusinessSurvey[]) => {
    try {
      await AsyncStorage.setItem("all_surveys", JSON.stringify(updatedSurveys));
    } catch (error) {
      console.error("Error saving surveys:", error);
    }
  }, []);

  const updateBusiness = useCallback(
    async (businessId: string, updates: Partial<BusinessProfile>) => {
      const updatedBusinesses = businesses.map((b) =>
        b.id === businessId ? { ...b, ...updates } : b
      );
      setBusinesses(updatedBusinesses);
      await saveBusinesses(updatedBusinesses);
    },
    [businesses, saveBusinesses]
  );

  const deleteBusiness = useCallback(
    async (businessId: string) => {
      const updatedBusinesses = businesses.filter((b) => b.id !== businessId);
      setBusinesses(updatedBusinesses);
      await saveBusinesses(updatedBusinesses);
    },
    [businesses, saveBusinesses]
  );

  const updateParticipant = useCallback(
    async (participantId: string, updates: Partial<UserProfile>) => {
      const updatedParticipants = participants.map((p) =>
        p.id === participantId ? { ...p, ...updates } : p
      );
      setParticipants(updatedParticipants);
      await saveParticipants(updatedParticipants);
    },
    [participants, saveParticipants]
  );

  const deleteParticipant = useCallback(
    async (participantId: string) => {
      const updatedParticipants = participants.filter((p) => p.id !== participantId);
      setParticipants(updatedParticipants);
      await saveParticipants(updatedParticipants);
    },
    [participants, saveParticipants]
  );

  const updateSurvey = useCallback(
    async (surveyId: string, updates: Partial<BusinessSurvey>) => {
      const updatedSurveys = allSurveys.map((s) =>
        s.id === surveyId ? { ...s, ...updates } : s
      );
      setAllSurveys(updatedSurveys);
      await saveSurveys(updatedSurveys);
    },
    [allSurveys, saveSurveys]
  );

  const deleteSurvey = useCallback(
    async (surveyId: string) => {
      const updatedSurveys = allSurveys.filter((s) => s.id !== surveyId);
      setAllSurveys(updatedSurveys);
      await saveSurveys(updatedSurveys);
    },
    [allSurveys, saveSurveys]
  );

  const adjustBusinessCredits = useCallback(
    async (businessId: string, amount: number) => {
      const updatedBusinesses = businesses.map((b) =>
        b.id === businessId ? { ...b, credits: b.credits + amount } : b
      );
      setBusinesses(updatedBusinesses);
      await saveBusinesses(updatedBusinesses);
    },
    [businesses, saveBusinesses]
  );

  const createSurvey = useCallback(
    async (survey: Omit<BusinessSurvey, "id" | "createdAt" | "businessId">) => {
      if (!admin) throw new Error("No admin profile found");

      const newSurvey: BusinessSurvey = {
        ...survey,
        id: `survey_admin_${Date.now()}`,
        createdAt: new Date(),
        businessId: admin.id,
      };

      const updatedSurveys = [...allSurveys, newSurvey];
      setAllSurveys(updatedSurveys);
      await saveSurveys(updatedSurveys);

      return newSurvey.id;
    },
    [admin, allSurveys, saveSurveys]
  );

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove(["user_authenticated", "user_type"]);
      console.log("Super admin logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }, []);

  const stats = useMemo<AdminStats>(() => {
    const totalRevenue = businesses.reduce((sum, b) => {
      return sum;
    }, 0);

    return {
      totalBusinesses: businesses.length,
      totalParticipants: participants.length,
      totalSurveys: allSurveys.length,
      totalRevenue,
      activeBusinesses: businesses.filter((b) => b.surveysCreated > 0).length,
      activeSurveys: allSurveys.filter((s) => s.status === "active").length,
      recentActivity,
    };
  }, [businesses, participants, allSurveys, recentActivity]);

  return useMemo(
    () => ({
      admin,
      stats,
      businesses,
      participants,
      allSurveys,
      isLoading,
      updateBusiness,
      deleteBusiness,
      updateParticipant,
      deleteParticipant,
      updateSurvey,
      deleteSurvey,
      adjustBusinessCredits,
      createSurvey,
      logout,
    }),
    [
      admin,
      stats,
      businesses,
      participants,
      allSurveys,
      isLoading,
      updateBusiness,
      deleteBusiness,
      updateParticipant,
      deleteParticipant,
      updateSurvey,
      deleteSurvey,
      adjustBusinessCredits,
      createSurvey,
      logout,
    ]
  );
});
