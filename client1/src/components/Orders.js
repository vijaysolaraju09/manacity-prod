import React from "react";
import { useSelector } from "react-redux";

function Orders() {
  const orders = useSelector((state) => state.user.userDetails.orders);
  console.log(orders);
  return <div>Orders</div>;
}

export default Orders;
