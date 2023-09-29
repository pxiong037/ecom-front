import {createGlobalStyle} from "styled-components";
import {CartContextProvider} from "@/components/CartContext";
import { SessionProvider } from "next-auth/react";

const GlobalStyles = createGlobalStyle`
  body{
    background-color: #eee;
    padding:0;
    margin:0;
    font-family: 'Poppins', sans-serif;
  }
`;

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={pageProps.session}>
        <GlobalStyles />
        <CartContextProvider>
          <Component {...pageProps} />
        </CartContextProvider>
    </SessionProvider>
  );
}