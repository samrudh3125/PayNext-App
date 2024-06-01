"use server"

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function createOnRampTransaction({ amount, provider}:{
    amount:number,
    provider:string
}) {
    const session=await getServerSession(authOptions);
    if(!session?.user||!session?.user.id){
        return {
            message:"Unauthorized"
        }
    }

    const token=Math.random().toString();

    await prisma.onRampTransactions.create({
        data:{
            status:"Pending",
            token,
            provider,
            amount,
            startTime:new Date(),
            userId:Number(session.user.id)
        }
    })

    return {
        message:"Success"
    }
}