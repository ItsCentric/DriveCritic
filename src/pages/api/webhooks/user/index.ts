import { Webhook } from 'svix'
import type { UserWebhookEvent } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from "~/env.mjs";
import { db } from '~/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).end()
        return
    }

    const svix_id = req.headers["svix-id"] as string;
    const svix_timestamp = req.headers["svix-timestamp"] as string;
    const svix_signature = req.headers["svix-signature"] as string;

    if (!svix_id || !svix_timestamp || !svix_signature) {
        res.status(400).json({ error: 'Invalid webhook headers' })
        res.end()
        return
    }

    const body = req.body as UserWebhookEvent;
    const webhook = new Webhook(env.CLERK_WEBHOOK_SECRET);

    let clerkEvent: UserWebhookEvent

    try {
        clerkEvent = webhook.verify(JSON.stringify(body), {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as UserWebhookEvent
    } catch (err) {
        res.status(400).json({ error: err })
        return
    }

    const { data: clerkUserData } = clerkEvent;

    if (!clerkUserData.id) {
        res.status(500).end()
        return
    }
    if (!("birthday" in clerkUserData)) {
        await handleUserDeletion(clerkUserData.id)
    }
    else {
        await handleNewUser(clerkUserData.id)
    }

    res.status(200).end();
}

async function handleNewUser(userId: string) {
    return await db.user.create({ data: { id: userId } })
}

async function handleUserDeletion(userId: string) {
    return await db.user.delete({ where: { id: userId } })
}
