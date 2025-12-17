import { Survey, UserProfile } from "@/types";

export const mockUser: UserProfile = {
  id: "user_new",
  name: "Utilisateur",
  email: "user@example.com",
  phone: "",
  status: "Autre",
  surveysCompleted: 0,
  points: 0,
  badges: [],
  joinedAt: new Date(),
};

export const mockSurveys: Survey[] = [];
