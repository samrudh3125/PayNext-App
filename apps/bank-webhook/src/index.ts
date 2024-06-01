import express from "express"
import db from "@repo/db/client"
const app=express();

app.use(express.json());

app.post("/",async (req,res)=>{
    //TODO add zod validation later
    //Check if this request has actually come from hdfc wehook
    const paymentInformation={
        token:req.body.token,
        userId:req.body.userId,
        amount:req.body.amount
    }
    try {
        const onRampTransaction=await db.onRampTransactions.findFirst({
            where:{
                token:paymentInformation.token
            }
        });
        if(onRampTransaction?.status!=="Pending"){
            res.status(411).json({
                message:"Transaction already processed"
            })
            return;
        }
        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        // You can also get this from your DB
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransactions.updateMany({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Success",
                }
            })
        ]);

        res.json({
            message: "Captured"
        })
    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }
})

app.listen(3002);