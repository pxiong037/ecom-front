import Header from "@/components/Header";
import Center from "@/components/Center";
import {mongooseConnect} from "@/lib/mongoose";
import Product from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { useState } from "react";

export default function Search({products}) {
  const [searchedProducts, setSearchedProducts] = useState(products);
  
  return (
    <>
      <Header setSearchedProducts={setSearchedProducts} focusSearch={true} />
      <Center>
        <Title>Search Results</Title>
        <ProductsGrid products={searchedProducts} />
      </Center>
    </>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const products = await Product.find({}, null, {sort:{'_id':-1}});
  return {
    props:{
      products: JSON.parse(JSON.stringify(products)),
    }
  };
}