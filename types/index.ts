export type Category = 
  | "Société" 
  | "Politique" 
  | "Divertissement" 
  | "Business" 
  | "Sport" 
  | "Santé"
  | "Technologie"
  | "Éducation";

export type QuestionType =
  | "single"
  | "multiple"
  | "scale"
  | "boolean"
  | "slider";

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  min?: number;
  max?: number;
  required: boolean;
}

export interface Answer {
  questionId: string;
  value: string | string[] | number | boolean;
}

export interface SurveyResult {
  questionId: string;
  votes: {
    [key: string]: number;
  };
  totalVotes: number;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  category: Category;
  creatorType: "admin" | "business";
  creatorName: string;
  questions: Question[];
  results?: SurveyResult[];
  participantCount: number;
  isPublic: boolean;
  isTrending: boolean;
  createdAt: Date;
  endsAt?: Date;
  imageUrl?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status?: "Étudiant" | "Salarié" | "Entrepreneur" | "Autre";
  photoUrl?: string;
  surveysCompleted: number;
  points: number;
  badges: Badge[];
  joinedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface CompletedSurvey {
  surveyId: string;
  completedAt: Date;
  answers: Answer[];
}

export interface BusinessProfile {
  id: string;
  companyName: string;
  email: string;
  phone?: string;
  taxId: string;
  logo?: string;
  description?: string;
  website?: string;
  industry?: string;
  surveysCreated: number;
  totalResponses: number;
  credits: number;
  isPremium: boolean;
  joinedAt: Date;
}

export type SurveyStatus = "draft" | "active" | "scheduled" | "ended" | "archived";

export type SurveyPrivacy = "public" | "private" | "semi-private";

export type TargetAgeRange = "18-24" | "25-34" | "35-44" | "45-54" | "55+" | "all";

export type TargetGender = "male" | "female" | "other" | "all";

export interface SurveyTargeting {
  ageRange?: TargetAgeRange[];
  gender?: TargetGender;
  location?: string[];
  maxResponses?: number;
}

export interface BusinessSurvey extends Survey {
  status: SurveyStatus;
  privacy: SurveyPrivacy;
  targeting?: SurveyTargeting;
  accessLink?: string;
  scheduledStart?: Date;
  businessId: string;
  costCredits: number;
}

export interface DemographicData {
  ageRange: TargetAgeRange;
  gender: TargetGender;
  location: string;
  count: number;
}

export interface SurveyStatistics {
  surveyId: string;
  totalResponses: number;
  completionRate: number;
  averageTimeMinutes: number;
  demographics: DemographicData[];
  responsesByDay: { date: string; count: number }[];
  questionStats: {
    questionId: string;
    answerDistribution: { [key: string]: number };
  }[];
}

export type PaymentMethod = "airtel" | "mobicash" | "card";

export interface PaymentTransaction {
  id: string;
  businessId: string;
  amount: number;
  credits: number;
  method: PaymentMethod;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  completedAt?: Date;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  description: string;
  popular?: boolean;
}

export interface SuperAdminProfile {
  id: string;
  email: string;
  role: "super_admin";
  name: string;
  createdAt: Date;
}

export interface AdminStats {
  totalBusinesses: number;
  totalParticipants: number;
  totalSurveys: number;
  totalRevenue: number;
  activeBusinesses: number;
  activeSurveys: number;
  recentActivity: AdminActivity[];
}

export interface AdminActivity {
  id: string;
  type: "business_signup" | "survey_created" | "credit_purchase" | "survey_completed";
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}
