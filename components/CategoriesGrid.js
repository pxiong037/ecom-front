import styled from "styled-components";
import Link from "next/link";

const StyledCategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  margin-bottom: 20px;
`;

const WhiteBox = styled(Link)`
  background-color: #fff;
  padding: 20px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  text-decoration: none;
  color: black;
  img{
    max-width: 100%;
    max-height: 80px;
  }
  &:hover {
    background-color: #222;
    color: white;
  }
`;

export default function CategoriesGrid({categories}) {
  return (
    <div>
      <StyledCategoriesGrid>
        {categories?.length > 0 && categories.map(category => (
          (
            <WhiteBox href={`/category/${category.name}`} key={category.name}>
              <div key={category.name}>
                {category.name}
              </div>
            </WhiteBox>
          )
        ))}
      </StyledCategoriesGrid>
      {categories?.length === 0 && <h3>No Categories Found.</h3>}
    </div>
  );
}