import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import {useContext, useState} from "react";
import {CartContext} from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/react"

const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  background-color: #222;
`;

const Logo = styled(Link)`
    color:#fff;
    text-decoration:none;
    position: relative;
    z-index: 3;
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
`;

const StyledNav = styled.nav`
    ${props => props.$mobilenavactive ? `
      display: block;
    ` : `
      display: none;
    `}
    gap: 15px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 70px 20px 20px;
    background-color: #222;
    @media screen and (min-width: 810px) {
      display: flex;
      position: static;
      padding: 0;
    }
`;

const SignIn = styled.div`
  display: block;
  color:#aaa;
  text-decoration:none;
  padding: 10px 0;
  cursor: pointer;
  @media screen and (min-width: 810px) {
    padding:0;
  }
  &:hover {
    color: #fff;
  }
`;

const NavLink = styled(Link)`
    display: block;
    color: #aaa;
    text-decoration: none;
    padding: 10px 0;
    @media screen and (min-width: 810px) {
      padding:0;
    }
    &:hover {
      color: #fff;
    }
`;

const NavButton = styled.button`
    background-color: transparent;
    width: 30px;
    height: 30px;
    border:0;
    color: white;
    cursor: pointer;
    position: relative;
    z-index: 3;
    @media screen and (min-width: 810px) {
      display: none;
    }
`;

const SearchBar = styled.div`
  display: flex;
  justify-content: start;
  background-color: white;
  border-radius: 5px;
  svg {
    height: 20px;
    width: 40px;
    background-color: white;
    border: none;
    border-radius: 5px;
    padding-top: 2px;
  };
  input {
    outline: none;
    border: none;
    width: 100%;
    border-radius: 5px;
  }
`;

export default function Header({setSearchedProducts, focusSearch}) {
    const router = useRouter();
    const {cartProducts} = useContext(CartContext);
    const [mobilenavactive,setMobilenavactive] = useState(0);
    const { data: session, status, update } = useSession()

    async function logout() {
      await router.push('/');
      await signOut();
    }

    const account = (status === "authenticated") ? 
      (<NavLink href={'/account'}>Account</NavLink>) : (<></>) ;
    const LoginOrLogout = (status === "authenticated") ? 
      (<SignIn onClick={() => logout()}>Logout</SignIn>) : (<SignIn onClick={() => signIn('google')}>Login</SignIn>);
    
    return (
      <StyledHeader>
        <Center>
          <Wrapper>
            <Logo href={'/'}>Ecommerce</Logo>
            <StyledNav $mobilenavactive={mobilenavactive}>
              <NavLink href={'/'}>Home</NavLink>
              <NavLink href={'/products'}>All Products</NavLink>
              <NavLink href={'/categories'}>Categories</NavLink>
              {account}
              {LoginOrLogout}
              <NavLink href={'/cart'}>Cart ({cartProducts.length})</NavLink>
              <SearchBar>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-2 h-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input 
                  type='text'
                  onChange={async (e) => {
                    await axios.get('/api/products?title=' + e.target.value).then(response => {
                      setSearchedProducts(response.data);
                    });
                  }}
                  placeholder='Search'
                  autoFocus={focusSearch}
                  onFocus={(e) => {
                    router.push('/search');
                  }}
                />
              </SearchBar>
            </StyledNav>
            <NavButton onClick={() => setMobilenavactive(prev => prev === 1 ? 0 : 1)}>
              <BarsIcon />
            </NavButton>
          </Wrapper>
        </Center>
      </StyledHeader>
    );
}