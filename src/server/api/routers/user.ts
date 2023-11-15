import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const getById = publicProcedure
    .input(z.string())
    .query(async ({ input: userId, ctx }) => {
        const user = await ctx.prisma.user.findUnique({
            where: {
                id: userId,
            },
        })

        if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Couldn't find that user" })

        return user
    })

export const userRouter = createTRPCRouter({
    getById
});
