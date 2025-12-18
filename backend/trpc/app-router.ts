import { createTRPCRouter } from "./create-context.js";
import hiRoute from "./routes/example/hi/route.js";
import { loginUserProcedure } from "./routes/auth/login-user/route.js";
import { signupUserProcedure } from "./routes/auth/signup-user/route.js";
import { loginBusinessProcedure } from "./routes/auth/login-business/route.js";
import { signupBusinessProcedure } from "./routes/auth/signup-business/route.js";
import { loginSuperAdminProcedure } from "./routes/auth/login-super-admin/route.js";
import { listSurveysProcedure } from "./routes/surveys/list/route.js";
import { getSurveyByIdProcedure } from "./routes/surveys/get-by-id/route.js";
import { createSurveyProcedure } from "./routes/surveys/create/route.js";
import { deleteSurveyProcedure } from "./routes/surveys/delete/route.js";
import { submitAnswersProcedure } from "./routes/surveys/submit-answers/route.js";
import { getSurveyResultsProcedure } from "./routes/surveys/get-results/route.js";
import { getBusinessProfileProcedure } from "./routes/business/get-profile/route.js";
import { getBusinessSurveysProcedure } from "./routes/business/get-surveys/route.js";
import { addCreditsProcedure } from "./routes/business/add-credits/route.js";
import { getAdminStatsProcedure } from "./routes/admin/get-stats/route.js";
import { getAllBusinessesProcedure } from "./routes/admin/get-businesses/route.js";
import { getAllParticipantsProcedure } from "./routes/admin/get-participants/route.js";
import { createSuperAdminProcedure } from "./routes/admin/create-super-admin/route.js";
import { testConnectionProcedure } from "./routes/test/connection/route.js";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  auth: createTRPCRouter({
    loginUser: loginUserProcedure,
    signupUser: signupUserProcedure,
    loginBusiness: loginBusinessProcedure,
    signupBusiness: signupBusinessProcedure,
    loginSuperAdmin: loginSuperAdminProcedure,
  }),
  surveys: createTRPCRouter({
    list: listSurveysProcedure,
    getById: getSurveyByIdProcedure,
    create: createSurveyProcedure,
    delete: deleteSurveyProcedure,
    submitAnswers: submitAnswersProcedure,
    getResults: getSurveyResultsProcedure,
  }),
  business: createTRPCRouter({
    getProfile: getBusinessProfileProcedure,
    getSurveys: getBusinessSurveysProcedure,
    addCredits: addCreditsProcedure,
  }),
  admin: createTRPCRouter({
    getStats: getAdminStatsProcedure,
    getBusinesses: getAllBusinessesProcedure,
    getParticipants: getAllParticipantsProcedure,
    createSuperAdmin: createSuperAdminProcedure,
  }),
  test: createTRPCRouter({
    connection: testConnectionProcedure,
  }),
});

export type AppRouter = typeof appRouter;
