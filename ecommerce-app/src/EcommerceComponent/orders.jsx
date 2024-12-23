import React from "react";
import { useSelector } from "react-redux";
import HeaderComponent from "../shared/headerComponent";
import useCartQuantities from "../shared/useCartQuantities";

const Orders = () => {
  const orders = useSelector((state) => state.orders.orders);
  const { totalQuantity } = useCartQuantities();

  return (
    <>
      <HeaderComponent
        currentComponent={"My Orders"}
        cartCount={totalQuantity}
      />
      <div className="orders-page mt-[2.4rem]">
        <h2 className="text-xl font-bold mb-4">My Orders</h2>
        {orders.length === 0 ? (
          <p className="text-[1.4rem] mt-[2.4rem]">You have not placed any order yet!</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">Order No.</th>
                <th className="border px-4 py-2">Customer Name</th>
                <th className="border px-4 py-2">Payment Status</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Order Date</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{order.orderNo}</td>
                  <td className="border px-4 py-2">{order.customerName}</td>
                  <td className="border px-4 py-2">{order.paymentStatus}</td>
                  <td className="border px-4 py-2">${order.amount}</td>
                  <td className="border px-4 py-2">{order.address}</td>
                  <td className="border px-4 py-2">{order.orderDate}</td>
                  <td className="border px-4 py-2">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Orders;