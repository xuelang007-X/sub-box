import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { login, logout, getUser, isAuthenticated } from "@/server/services/authentication-service";
import { TRPCError } from "@trpc/server";
import { headers } from "next/headers";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({
      username: z.string(),
      password: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // 从请求头中获取 IP
      const headersList = headers();
      const ip = headersList.get("x-forwarded-for") || "unknown";
      
      const success = await login(input.username, input.password, ip);
      if (!success) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }
      return { success };
    }),

  logout: publicProcedure
    .mutation(async () => {
      await logout();
      return { success: true };
    }),

  getUser: publicProcedure
    .query(async () => {
      return await getUser();
    }),

  isAuthenticated: publicProcedure
    .query(async () => {
      return await isAuthenticated();
    }),
}); 