import React, { useState, lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import HeaderComponent from "../shared/headerComponent";
import { useNavigate } from "react-router-dom";
import { addOrder } from "../redux/ordersSlice";
import useProductDetails from "../shared/useProductDetails";
import { clearCart } from "../redux/cartSlice";
import { toast } from "react-toastify";
const AddressForm = lazy(() => import("./AddressForm"));
const PaymentForm = lazy(() => import("./PaymentForm"));

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState("address");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    zipcode: "",
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
  });
  
  const { totalQuantity } = useProductDetails();
  const cartItems = useSelector((state) => state.cart.items);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    const updatedFormData = { ...formData };
    Object.entries(e).forEach(([key, value]) => {
      updatedFormData[key] = value;
    });
    setFormData(updatedFormData);
  };

  const handlePayment = () => {
    const orderDetails = {
      orderNo: Math.floor(Math.random() * 1000),
      customerName: formData?.firstName + " " + formData?.lastName,
      paymentStatus: "Paid",
      amount: subtotal,
      address: formData.city + ", " + formData.country,
      orderDate: new Date().toLocaleDateString(),
      status: "Confirmed",
    };

    dispatch(addOrder(orderDetails));
    navigate("/orders");
  };

  const handleSubmit = (e) => {
    handleInputChange(e);
    if (step === "address") {
      setStep("payment");
    } else {
      handlePayment();
      toast.success(`Order placed successfully!`);
      dispatch(clearCart());
    }
  };

  return (
    <>
      <HeaderComponent
        currentComponent={"My Orders"}
        cartCount={totalQuantity}
      />
      <div className="flex justify-center items-start p-2 bg-gray-100 mt-[1.6rem]">
        <div className="w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>
          <div className="flex space-x-4 mb-6">
            <div
              className={`font-semibold ${
                step === "address" ? "text-black" : "text-gray-500"
              }`}
            >
              Address
            </div>
            <div className="text-gray-400">&#8212;</div>
            <div
              className={`font-semibold ${
                step === "payment" ? "text-black" : "text-gray-500"
              }`}
            >
              Payment
            </div>
          </div>

          <div className="flex flex-row justify-between gap-4 mb-6">
            <div className="w-[26rem]">
              {step === "address" && (
                <Suspense fallback={<div>Loading...</div>}>
                  <AddressForm
                    handleSubmit={handleSubmit}
                    nextButtonText={"Continue to Shipping"}
                  />
                </Suspense>
              )}

              {step === "payment" && (
                <Suspense fallback={<div>Loading...</div>}>
                  <PaymentForm
                    handlePayment={handleSubmit}
                    nextButtonText={"Pay with card"}
                  />
                </Suspense>
              )}
            </div>

            <div className="mt-6 mr-10 w-[20rem]">
              <h2 className="text-lg font-semibold mb-4">Your Cart</h2>
              <div>
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between mb-4">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">${item.price}</p>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">Subtotal</p>
                  <p>${subtotal}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">Shipping</p>
                  <p className="text-[0.8rem] text-gray-500">
                    Calculated at the next step
                  </p>
                </div>
                <div className="flex justify-between font-semibold">
                  <p>Total</p>
                  <p>${subtotal}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
