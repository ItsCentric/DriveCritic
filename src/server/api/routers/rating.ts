import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const rateUser = publicProcedure
  .input(
    z.object({
      authorId: z.string(),
      ratedUserId: z.string(),
      stars: z.number().min(0).max(5),
      comment: z.union([z.string(), z.undefined()]),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    let rating,
      count = 1,
      total = input.stars;

    rating = await ctx.prisma.rating.findUnique({
      where: {
        authorId_ratedUserId: {
          authorId: input.authorId,
          ratedUserId: input.ratedUserId,
        },
      },
    });
    if (!rating) {
      rating = await ctx.prisma.rating.create({ data: input });
    } else {
      count = 0;
      total = input.stars - rating.stars;
      rating = await ctx.prisma.rating.update({
        where: {
          authorId_ratedUserId: {
            authorId: input.authorId,
            ratedUserId: input.ratedUserId,
          },
        },
        data: {
          stars: input.stars,
        },
      });
    }
    // update ratingCount and ratingTotal in the user table to be able to calculate the average rating quickly if needed
    await ctx.prisma.user.update({
      where: {
        id: input.ratedUserId,
      },
      data: {
        ratingCount: { increment: count },
        ratingTotal: { increment: total },
      },
    });
    return rating;
  });

const getRatingFromUser = publicProcedure
  .input(
    z.object({
      authorId: z.string(),
      ratedUserId: z.string(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const rating = await ctx.prisma.rating.findUnique({
      where: { authorId_ratedUserId: input },
    });

    // Just return -1 if no rating exists yet
    return rating?.stars ?? -1;
  });

const getAverageRating = publicProcedure
  .input(z.string())
  .query(async ({ input, ctx }) => {
    const ratingData = await ctx.prisma.user.findUnique({
      where: { id: input },
      select: {
        ratingCount: true,
        ratingTotal: true,
      },
    });
    if (
      ratingData?.ratingCount &&
      ratingData.ratingTotal &&
      ratingData.ratingCount != 0
    ) {
      return ratingData.ratingTotal / ratingData.ratingCount;
    }
    return -1;
  });

export const ratingRouter = createTRPCRouter({
  rateUser,
  getRatingFromUser,
  getAverageRating,
});
