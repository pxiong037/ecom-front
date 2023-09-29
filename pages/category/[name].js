import Header from "@/components/Header";
import Center from "@/components/Center";
import {mongooseConnect} from "@/lib/mongoose";
import Category from "@/models/Category";
import Product from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { useRouter } from "next/router";

export default function ProductsPage({products}) {
  const router = useRouter();

  return (
    <>
      <Header />
      <Center>
        <Title>{router.query.name}</Title>
        <ProductsGrid products={products} />
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const {name} = context.query;
  const category = await Category.find({ "name": name });
  const products = await Product.find({ "category": category[0]._id });

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    }
  }
}