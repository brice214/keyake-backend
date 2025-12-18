import { publicProcedure } from '../../../create-context.js';
import { z } from 'zod';
import { db } from '../../../../db/index.js';
import { Survey, Question } from '../../../../db/schema.js';

export const createSurveyProcedure = publicProcedure
  .input(
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.enum([
        'Société',
        'Politique',
        'Divertissement',
        'Business',
        'Sport',
        'Santé',
        'Technologie',
        'Éducation',
      ]),
      creatorType: z.enum(['admin', 'business']),
      creatorName: z.string(),
      isPublic: z.boolean().default(true),
      endsAt: z.date().optional(),
      imageUrl: z.string().optional(),
      businessId: z.string().optional(),
      questions: z.array(
        z.object({
          text: z.string(),
          type: z.enum(['single', 'multiple', 'scale', 'boolean', 'slider']),
          options: z.array(z.string()).optional(),
          min: z.number().optional(),
          max: z.number().optional(),
          required: z.boolean().default(true),
        })
      ),
    })
  )
  .mutation(async ({ input }) => {
    const surveyId = `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const [survey] = await db
      .insert(Survey)
      .values({
        id: surveyId,
        title: input.title,
        description: input.description,
        category: input.category,
        creatorType: input.creatorType,
        creatorName: input.creatorName,
        isPublic: input.isPublic,
        isTrending: false,
        participantCount: 0,
        createdAt: new Date(),
        endsAt: input.endsAt,
        imageUrl: input.imageUrl,
        businessId: input.businessId,
        costCredits: 0,
        status: 'active',
        privacy: 'public',
      })
      .returning();

    const questionValues = input.questions.map((q, index) => ({
      id: `question_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
      surveyId: surveyId,
      text: q.text,
      type: q.type,
      options: q.options || null,
      min: q.min ?? null,
      max: q.max ?? null,
      required: q.required,
      order: index,
    }));

    await db.insert(Question).values(questionValues);

    return survey;
  });
