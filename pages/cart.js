import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import {useContext, useEffect, useState} from "react";
import {CartContext} from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import Link from "next/link";
import { useSession } from "next-auth/react"
import Image from 'next/image'

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    @media screen and (min-width: 810px) {
        grid-template-columns: 1.2fr .8fr;
    }
    gap: 40px;
    margin-top: 40px;
    margin-bottom: 20px;
`;

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
`;

const OrderInfoBox = styled.form`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
    height: 280px;
    position: sticky;
    top: 5em;
`;

const ProductInfoCell = styled.td`
    padding: 10px 0;
`;

const ProductImageBox = styled(Link)`
    width: 70px;
    height: 100px;
    padding: 2px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    display:flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    cursor: pointer;
    img{
        max-width: 60px;
        max-height: 60px;
    }
    @media screen and (min-width: 810px) {
        padding: 10px;
        width: 100px;
        height: 100px;
        img{
            max-width: 80px;
            max-height: 80px;
        }
    }
`;

const QuantityLabel = styled.span`
    padding: 0 15px;
    display: block;
    @media screen and (min-width: 810px) {
        display: inline-block;
        padding: 0 10px;
    }
`;

const CityHolder = styled.div`
    display:flex;
    gap: 5px;
`;

export default function CartPage() {
    const {cartProducts,addProduct,removeProduct,clearCart} = useContext(CartContext);
    const [products,setProducts] = useState([]);
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [city,setCity] = useState('');
    const [postalCode,setPostalCode] = useState('');
    const [streetAddress,setStreetAddress] = useState('');
    const [country,setCountry] = useState('');
    const [isSuccess,setIsSuccess] = useState(false);
    const { data: session, status } = useSession();

    useEffect(() => {
        if (cartProducts.length > 0) {
        axios.post('/api/cart', {ids:cartProducts})
            .then(response => {
            setProducts(response.data);
            })
        } else {
            setProducts([]);
        }
    }, [cartProducts]);
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        if (window?.location.href.includes('success')) {
            setIsSuccess(true);
            clearCart();
        }
    }, [clearCart]);
    function moreOfThisProduct(id) {
        addProduct(id);
    }
    function lessOfThisProduct(id) {
        removeProduct(id);
    }
    async function goToPayment(ev) {
        ev.preventDefault();
        if(name && city && postalCode && streetAddress && country && cartProducts && status === "authenticated"){
            setEmail(session?.user?.email);
            const response = await axios.post('/api/checkout', {
                name,email: session?.user?.email,city,postalCode,streetAddress,country,
                cartProducts,
            });
            if (response.data.url) {
                window.location = response.data.url;
            }
        }
    }
    let total = 0;
    for (const productId of cartProducts) {
        const price = products.find(p => p._id === productId)?.price || 0;
        total += price;
    }

    if (isSuccess) {
        return (
        <>
            <Header />
            <Center>
                <ColumnsWrapper>
                    <Box>
                    <h1>Thanks for your order!</h1>
                    <p>We will email you your order details.</p>
                    </Box>
                </ColumnsWrapper>
            </Center>
        </>
        );
    }
    return (
        <>
        <Header />
        <Center>
            <ColumnsWrapper>
            <Box>
                <h2>Cart</h2>
                {!cartProducts?.length && (
                <div>Your cart is empty</div>
                )}
                {products?.length > 0 && (
                <Table>
                    <thead>
                    <tr>
                        <th>Product</th>
                        <th width="130px">Quantity</th>
                        <th>Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                        <ProductInfoCell>
                            <ProductImageBox href={'/product/' + product._id}>
                                <Image src={product.images[0]} alt="" />
                            </ProductImageBox>
                            {product.title}
                        </ProductInfoCell>
                        <td>
                            <Button
                                $width={"40px"}
                                $height={"30px"}
                                onClick={() => lessOfThisProduct(product._id)}>
                                -
                            </Button>
                            <QuantityLabel>
                                {cartProducts.filter(id => id === product._id).length}
                            </QuantityLabel>
                            <Button
                                $width={"40px"}
                                $height={"30px"}
                                onClick={() => moreOfThisProduct(product._id)}>
                                +
                            </Button>

                        </td>
                        <td>
                            ${cartProducts.filter(id => id === product._id).length * product.price}
                        </td>
                        </tr>
                    ))}
                    <tr>
                        <td>Total</td>
                        <td></td>
                        <td>${total}</td>
                    </tr>
                    </tbody>
                </Table>
                )}
            </Box>
            {!!cartProducts?.length && (
                <OrderInfoBox onSubmit={goToPayment}>
                <h2>Order Information</h2>
                <Input type="text"
                        placeholder="Name"
                        value={name}
                        name="name"
                        required
                        onChange={ev => setName(ev.target.value)} />
                <CityHolder>
                    <Input type="text"
                        placeholder="City"
                        value={city}
                        name="city"
                        required
                        onChange={ev => setCity(ev.target.value)}/>
                    <Input type="text"
                        placeholder="Postal Code"
                        value={postalCode}
                        name="postalCode"
                        required
                        onChange={ev => setPostalCode(ev.target.value)}/>
                </CityHolder>
                <Input type="text"
                        placeholder="Street Address"
                        value={streetAddress}
                        name="streetAddress"
                        required
                        onChange={ev => setStreetAddress(ev.target.value)}/>
                <Input type="text"
                        placeholder="Country"
                        value={country}
                        name="country"
                        required
                        onChange={ev => {
                            setCountry(ev.target.value)
                        }}/>
                <Button $black={1} $block={1} type="submit" value="Submit" disabled={status === "authenticated" ? false : true} $disabled={status === "authenticated" ? 0 : 1}>
                    Continue to payment
                </Button>
                </OrderInfoBox>
            )}
            </ColumnsWrapper>
        </Center>
        </>
    );
}