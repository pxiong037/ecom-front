import clientPromise from "@/lib/mongodb";
import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import mongoose from "mongoose";

export default async function handle(req, res){
    const {method} = req;
    await mongooseConnect();
    mongoose.Promise = clientPromise;
    const Product = mongoose.model("Product");

    if(method === 'GET'){
        if(req.query?.title){
            const products = await Product.find({ "title": { $regex: '.*' + req.query.title + '.*', $options: 'i' } });
            res.json(products);
        } else{
            res.json(await Product.find({}, null, {sort:{'_id':-1}}));
        }
    }
}