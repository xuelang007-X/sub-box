import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { subscriptionService } from "@/server/services/subscription-service";
import { userService } from "@/server/services/user-service";
import { clashConfigService } from "@/server/services/clash-config-service";
import { TRPCError } from "@trpc/server";

export const subscriptionRouter = createTRPCRouter({
  generateSubscription: protectedProcedure
    .input(z.object({
      userId: z.string(),
      subconverterId: z.string().nullable().optional(),
    }))
    .mutation(async ({ input }) => {
      return await subscriptionService.generateSubscription({
        userId: input.userId,
        subconverterId: input.subconverterId,
      });
    }),
  
  // 公共API，通过订阅密钥获取订阅内容
  getSubscriptionByKey: publicProcedure
    .input(z.object({
      key: z.string(),
      format: z.string().optional().default("clash"),
      configId: z.string().optional(),
    }))
    .query(async ({ input }) => {
      // 1. 查找用户
      const user = await userService.findBySubscriptionKey(input.key);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // 2. 生成订阅内容
      const originalYaml = await subscriptionService.generateSubscription({
        userId: user.id,
        subconverterId: user.subconverterId,
      });

      // 3. 检查是否需要合并配置
      let finalYaml = originalYaml;
      if (input.configId) {
        const targetConfig = await clashConfigService.get(input.configId);
        if (targetConfig) {
          finalYaml = await clashConfigService.mergeConfig(originalYaml, targetConfig);
        }
      }

      return finalYaml;
    }),
}); 