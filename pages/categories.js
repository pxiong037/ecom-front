import Header from "@/components/Header";
import Center from "@/components/Center";
import {mongooseConnect} from "@/lib/mongoose";
import Category from "@/models/Category";
import CategoriesGrid from "@/components/CategoriesGrid";
import Title from "@/components/Title";
import { useState } from "react";

export default function Categories({categories}) {
  const [category, setCategory] = useState(categories);
  return (
    <>
      <Header />
      <Center>
        <Title>Categories</Title>
        <CategoriesGrid categories={category} />
      </Center>
    </>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const categories = await Category.find({}, null, {sort:{'_id':-1}});

  return {
    props:{
      categories: JSON.parse(JSON.stringify(categories)),
    }
  };
}