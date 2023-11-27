import Head from "next/head";

import { db as prisma } from "../../server/db";
import { appRouter } from "../../server/api/root";
import SuperJSON from "superjson";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/nextjs";

import { api } from "../../utils/api";
import { useEffect, useState } from "react";

export default function Profile({ profile }) {
  profile = profile && SuperJSON.deserialize(profile);
  const { user: clerkUser } = useUser();
  const user = api.user.getById.useQuery(clerkUser?.id ?? "", {
    enabled: !!clerkUser?.id,
  }).data;

  const initialRating = api.rating.getRatingFromUser.useQuery(
    { authorId: user?.id ?? "", ratedUserId: profile?.id ?? "" },
    { enabled: !!user?.id },
  ).data;
  const [selectedRating, setSelectedRating] = useState(null);

  const averageRating = api.rating.getAverageRating.useQuery(
    profile?.id ?? "",
    { enabled: !!profile?.id },
  ).data;

  const mutation = api.rating.rateUser.useMutation();

  const utils = api.useUtils();

  async function handleRatingClick(event) {
    setSelectedRating(parseInt(event.currentTarget.value));
    await mutation.mutateAsync({
      authorId: user.id,
      ratedUserId: profile.id,
      stars: parseInt(event.currentTarget.value),
      // comment: "",
    });
    utils.rating.getAverageRating.invalidate();
  }
  if (!profile) {
    return (
      <>
        <Head>
          <title>Hello </title>
        </Head>
        This Profile doesn't exist
      </>
    );
  }
  return (
    <>
      <Head>
        <title>Hello </title>
      </Head>
      <p>Average Rating:</p>
      <div className="rating rating-lg gap-1">
        {[1, 2, 3, 4, 5].map((rating, index) => (
          <input
            type="radio"
            name="rating-2"
            key={index}
            value={rating}
            className="mask mask-star"
            checked={(averageRating) == rating}
            disabled
          />
        ))}
      </div>
      <p>
        {averageRating
          ? `Average Rating: ${averageRating}`
          : "No rating yet"}
      </p>
      <SignedIn>
        {(selectedRating ?? initialRating) && (
          <>
            <p>Your Rating:</p>
            <div className="rating rating-lg gap-1">
              {[1, 2, 3, 4, 5].map((rating, index) => (
                <input
                  type="radio"
                  name="rating-1"
                  key={index}
                  value={rating}
                  className="mask mask-star"
                  checked={(selectedRating ?? initialRating) == rating}
                  onChange={handleRatingClick}
                />
              ))}
            </div>
          </>
        )}
        <p>your id is {user?.id}</p>
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <button className="rounded-xl bg-primary px-3 py-2 font-bold">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const trpc = appRouter.createCaller({ prisma: prisma });
  let result;
  try {
    result = await trpc.user.getById(params.id);
  } catch (error) {
    return {
      props: { profile: null },
    };
  }

  return {
    props: {
      profile: SuperJSON.serialize(result),
    },
  };
}
