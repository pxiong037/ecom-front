import {mongooseConnect} from "@/lib/mongoose";
import Product from "@/models/Product";
import Order from "@/models/Order";
const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handler(req,res) {
  const {
    name,email,city,
    postalCode,streetAddress,country,
    cartProducts,
  } = req.body;

  if (req.method !== 'POST') {
    res.json('should be a POST request');
    return;
  } else if(name && email && city && 
    postalCode && streetAddress && country && 
    cartProducts){
    await mongooseConnect();
    const productsIds = cartProducts;
    const uniqueIds = [...new Set(productsIds)];
    const productsInfos = await Product.find({_id:uniqueIds});
  
    let line_items = [];
    for (const productId of uniqueIds) {
      const productInfo = productsInfos.find(p => p._id.toString() === productId);
      const quantity = productsIds.filter(id => id === productId)?.length || 0;

      if (quantity > 0 && productInfo) {
        line_items.push({
          quantity,
          price_data: {
            currency: 'USD',
            product_data: {
              name: productInfo.title,
              images: productInfo.images
            },
            unit_amount: quantity * productInfo.price * 100,
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1
          }
        });
      }
    }
  
    const orderDoc = await Order.create({
      line_items,name,email,city,postalCode,
      streetAddress,country,paid:false,
    });
  
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      customer_email: email,
      shipping_options: [
        {shipping_rate: 'shr_1NvSbRAI4VAKYcAXsIpkIP93'},
        {shipping_rate: 'shr_1NvSceAI4VAKYcAXbpOXqxEM'},
      ],
      success_url: process.env.PUBLIC_URL + '/cart?success=1',
      cancel_url: process.env.PUBLIC_URL + '/cart?canceled=1',
      metadata: {orderId:orderDoc._id.toString(),test:'ok'},
    });
  
    res.json({
      url:session.url,
    })
  } else{
    res.json('Fields cannot be left blank.');
    return;
  }
}