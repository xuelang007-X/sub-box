import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { exportService } from "@/server/services/export-service";
import { type ExportData } from "@/server/services/export-service";

export const exportRouter = createTRPCRouter({
  exportAll: protectedProcedure
    .query(async () => {
      return await exportService.exportAll();
    }),

  importAll: protectedProcedure
    .input(z.object({
      data: z.custom<ExportData>((data) => true), // 自定义校验器，接受ExportData类型
      options: z.object({
        skipExisting: z.boolean().default(true),
      }).optional(),
    }))
    .mutation(async ({ input }) => {
      await exportService.importAll(input.data, input.options || { skipExisting: true });
      return { success: true };
    }),
}); 