import { getServerSession } from "next-auth";
import { P2PTransfer } from "../../../components/P2PTransfer";
import { SendCard } from "../../../components/SendCard";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

async function getTransfers(){
    const session=await getServerSession(authOptions);
    const transfers=await prisma.p2pTransfer.findMany({
        where:{
            fromUserId:Number(session.user?.id)
        }
    });
    return transfers.map((t:any)=>({
        timestamp:t.timestamp,
        amount:t.amount,
        fromUserId:t.fromUserId,
        toUserId:t.toUserId
    }))
}

export default async function() {
    const transfers=await getTransfers()
    return <div className="w-full">
        <SendCard />
        <P2PTransfer transfers={transfers}/>
    </div>
}
