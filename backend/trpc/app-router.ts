import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { loginUserProcedure } from "./routes/auth/login-user/route";
import { signupUserProcedure } from "./routes/auth/signup-user/route";
import { loginBusinessProcedure } from "./routes/auth/login-business/route";
import { signupBusinessProcedure } from "./routes/auth/signup-business/route";
import { loginSuperAdminProcedure } from "./routes/auth/login-super-admin/route";
import { listSurveysProcedure } from "./routes/surveys/list/route";
import { getSurveyByIdProcedure } from "./routes/surveys/get-by-id/route";
import { createSurveyProcedure } from "./routes/surveys/create/route";
import { deleteSurveyProcedure } from "./routes/surveys/delete/route";
import { submitAnswersProcedure } from "./routes/surveys/submit-answers/route";
import { getSurveyResultsProcedure } from "./routes/surveys/get-results/route";
import { getBusinessProfileProcedure } from "./routes/business/get-profile/route";
import { getBusinessSurveysProcedure } from "./routes/business/get-surveys/route";
import { addCreditsProcedure } from "./routes/business/add-credits/route";
import { getAdminStatsProcedure } from "./routes/admin/get-stats/route";
import { getAllBusinessesProcedure } from "./routes/admin/get-businesses/route";
import { getAllParticipantsProcedure } from "./routes/admin/get-participants/route";
import { createSuperAdminProcedure } from "./routes/admin/create-super-admin/route";
import { testConnectionProcedure } from "./routes/test/connection/route";

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
