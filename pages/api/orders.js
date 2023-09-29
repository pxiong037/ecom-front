import {mongooseConnect} from "@/lib/mongoose";
import Order from "@/models/Order";
import mongoose from "mongoose";
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

export default async function handler(req,res) {
  const {method} = req;
  await mongooseConnect();
  const session = await getServerSession(req, res, authOptions)
  const Order = mongoose.model("Order");

  if(method === 'GET'){
    if(session?.user?.email){
        const orders = await Order.find({
           "email": { $regex: '.*' + session?.user?.email + '.*', $options: 'i' },
           "paid": "true"
        }).sort({"createdAt": -1});
        res.json(orders);
    }
  }
  
}