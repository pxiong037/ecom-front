import Header from "@/components/Header";
import Center from "@/components/Center";
import Title from "@/components/Title";
import Button from "@/components/Button";
import styled from "styled-components";
import {useEffect, useState} from "react";
import axios from "axios";
import { useSession } from "next-auth/react"
import { v4 as uuidv4 } from 'uuid';

const AccountImage = styled.img`
  border-radius: 50%;
  width: 80px;
  height: 80px;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Orders = styled.div`
  text-align: center;
`;

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid black;
`;

const RowHeader = styled.th`
  background: #000;
  color: #fff;
  border: 1px solid black;
`;

const Row = styled.td`
  border: 1px solid;
`;

const PaidRow = styled.td`
  border: 1px solid;
  ${props => props.$paid ? `
    color: #50C878;
    border: 1px solid black;
    ` : `
    color: #FF5733;
    border: 1px solid black;
  `}
`;

const WhiteBox = styled.div`
  margin-top: 40px;
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  margin-bottom: 20px;
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

export default function Account() {
  const [orders, setOrders] = useState([]);
  const { data: session } = useSession();
  const noOrderFoundMessage = "No Order(s) Found.";

  useEffect(() => {
    const getOrders = async () => {
      await axios.get('/api/orders').then(response => {
        setOrders(response.data);
      });
    }
    getOrders();
  }, []);

  return <>
      <Header />
      <Center>
          <WhiteBox>
            <Container>
              <Title>{session?.user?.name}</Title>
              <AccountImage src={session?.user?.image} alt=""/>
            </Container>
            <Orders>
              <Title>Orders</Title>
              <OrdersTable>
                <thead>
                  <tr>
                    <RowHeader>Date</RowHeader>
                    <RowHeader>Name</RowHeader>
                    <RowHeader>Email</RowHeader>
                    <RowHeader>Address</RowHeader>
                    <RowHeader>Products</RowHeader>
                  </tr>
                </thead>
                <tbody>
                {orders.length > 0 && orders.map(order => (
                  <tr key={uuidv4()}>
                    <Row key={uuidv4()}>
                      {(new Date(order.createdAt)).toLocaleString()}
                    </Row>
                    <Row key={uuidv4()}>
                      {order.name}
                    </Row>
                    <Row key={uuidv4()}>
                      {order.email}
                    </Row>
                    <Row key={uuidv4()}>
                      {order.streetAddress},<br />
                      {order.city} {order.postalCode},<br />
                      {order.country}
                    </Row>
                    <Row key={uuidv4()}>
                      {order.line_items.map(l => (
                        <span key={uuidv4()}>
                          {l.price_data?.product_data.name} x
                          {l.quantity}<br/>
                        </span>
                      ))}
                    </Row>
                  </tr>
                ))}
                </tbody>
              </OrdersTable>
              {orders.length === 0 ? <Title>{noOrderFoundMessage}</Title> : <></>}
            </Orders>
          </WhiteBox>
      </Center>
    </>
}