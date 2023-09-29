import styled from "styled-components";
import ProductBox from "@/components/ProductBox";

const StyledProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  margin-bottom: 20px;
`;

export default function ProductsGrid({products}) {
  return (
    <div>
      <StyledProductsGrid>
        {products?.length > 0 && products.map(product => (
          <ProductBox key={product._id} {...product} />
        ))}
      </StyledProductsGrid>
      {products?.length === 0 && <h3>No Product(s) Found.</h3>}
    </div>
  );
}