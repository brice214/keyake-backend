import { pgTable, text, timestamp, integer, boolean, jsonb, pgEnum, serial, real } from 'drizzle-orm/pg-core';

export const categoryEnum = pgEnum('category', [
  'Société',
  'Politique',
  'Divertissement',
  'Business',
  'Sport',
  'Santé',
  'Technologie',
  'Éducation'
]);

export const questionTypeEnum = pgEnum('question_type', [
  'single',
  'multiple',
  'scale',
  'boolean',
  'slider'
]);

export const creatorTypeEnum = pgEnum('creator_type', ['admin', 'business']);

export const surveyStatusEnum = pgEnum('survey_status', [
  'draft',
  'active',
  'scheduled',
  'ended',
  'archived'
]);

export const surveyPrivacyEnum = pgEnum('survey_privacy', [
  'public',
  'private',
  'semi-private'
]);

export const targetAgeRangeEnum = pgEnum('target_age_range', [
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55+',
  'all'
]);

export const targetGenderEnum = pgEnum('target_gender', ['male', 'female', 'other', 'all']);

export const paymentMethodEnum = pgEnum('payment_method', ['airtel', 'mobicash', 'card']);

export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed']);

export const userStatusEnum = pgEnum('user_status', [
  'Étudiant',
  'Salarié',
  'Entrepreneur',
  'Autre'
]);

export const activityTypeEnum = pgEnum('activity_type', [
  'business_signup',
  'survey_created',
  'credit_purchase',
  'survey_completed'
]);

export const User = pgTable('User', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: text('phone'),
  status: userStatusEnum('status'),
  photoUrl: text('photo_url'),
  surveysCompleted: integer('surveys_completed').notNull().default(0),
  points: integer('points').notNull().default(0),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

export const Business = pgTable('Business', {
  id: text('id').primaryKey(),
  companyName: text('company_name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: text('phone'),
  taxId: text('tax_id').notNull(),
  logo: text('logo'),
  description: text('description'),
  website: text('website'),
  industry: text('industry'),
  surveysCreated: integer('surveys_created').notNull().default(0),
  totalResponses: integer('total_responses').notNull().default(0),
  credits: integer('credits').notNull().default(0),
  isPremium: boolean('is_premium').notNull().default(false),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

export const SuperAdmin = pgTable('SuperAdmin', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('super_admin'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const Survey = pgTable('Survey', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: categoryEnum('category').notNull(),
  creatorType: creatorTypeEnum('creator_type').notNull(),
  creatorName: text('creator_name').notNull(),
  participantCount: integer('participant_count').notNull().default(0),
  isPublic: boolean('is_public').notNull().default(true),
  isTrending: boolean('is_trending').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  endsAt: timestamp('ends_at'),
  imageUrl: text('image_url'),
  status: surveyStatusEnum('status').notNull().default('active'),
  privacy: surveyPrivacyEnum('privacy').notNull().default('public'),
  accessLink: text('access_link'),
  scheduledStart: timestamp('scheduled_start'),
  businessId: text('business_id'),
  costCredits: integer('cost_credits').notNull().default(0),
});

export const Question = pgTable('Question', {
  id: text('id').primaryKey(),
  surveyId: text('survey_id').notNull().references(() => Survey.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  type: questionTypeEnum('type').notNull(),
  options: jsonb('options'),
  min: integer('min'),
  max: integer('max'),
  required: boolean('required').notNull().default(true),
  order: integer('order').notNull().default(0),
});

export const Answer = pgTable('Answer', {
  id: serial('id').primaryKey(),
  surveyId: text('survey_id').notNull().references(() => Survey.id, { onDelete: 'cascade' }),
  questionId: text('question_id').notNull().references(() => Question.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => User.id, { onDelete: 'cascade' }),
  value: jsonb('value').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const CompleteSurvey = pgTable('CompleteSurvey', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => User.id, { onDelete: 'cascade' }),
  surveyId: text('survey_id').notNull().references(() => Survey.id, { onDelete: 'cascade' }),
  completedAt: timestamp('completed_at').notNull().defaultNow(),
});

export const SurveyResult = pgTable('SurveyResult', {
  id: serial('id').primaryKey(),
  surveyId: text('survey_id').notNull().references(() => Survey.id, { onDelete: 'cascade' }),
  questionId: text('question_id').notNull().references(() => Question.id, { onDelete: 'cascade' }),
  votes: jsonb('votes').notNull(),
  totalVotes: integer('total_votes').notNull().default(0),
});

export const SurveyTargeting = pgTable('SurveyTargeting', {
  id: serial('id').primaryKey(),
  surveyId: text('survey_id').notNull().references(() => Survey.id, { onDelete: 'cascade' }).unique(),
  ageRange: jsonb('age_range'),
  gender: targetGenderEnum('gender'),
  location: jsonb('location'),
  maxResponses: integer('max_responses'),
});

export const Badges = pgTable('Badges', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => User.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(),
  earnedAt: timestamp('earned_at').notNull().defaultNow(),
});

export const PaymentTransaction = pgTable('PaymentTransaction', {
  id: text('id').primaryKey(),
  businessId: text('business_id').notNull().references(() => Business.id, { onDelete: 'cascade' }),
  amount: real('amount').notNull(),
  credits: integer('credits').notNull(),
  method: paymentMethodEnum('method').notNull(),
  status: paymentStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
});

export const AdminActivity = pgTable('AdminActivity', {
  id: text('id').primaryKey(),
  type: activityTypeEnum('type').notNull(),
  description: text('description').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  metadata: jsonb('metadata'),
});
