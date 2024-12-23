import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import HeaderComponent from "../shared/headerComponent";
import { useNavigate } from "react-router-dom";
import { addOrder } from "../redux/ordersSlice";
import useCartQuantities from "../shared/useCartQuantities";
import { clearCart } from "../redux/cartSlice";
import { toast } from "react-toastify";

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

  const [errors, setErrors] = useState({});
  const { totalQuantity } = useCartQuantities();
  const cartItems = useSelector((state) => state.cart.items);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const validate = () => {
    const newErrors = {};
    if (step === "address") {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.country) newErrors.country = "Country is required";
      if (!formData.zipcode) newErrors.zipcode = "Zipcode is required";
    } else if (step === "payment") {
      if (!formData.cardholderName)
        newErrors.cardholderName = "Cardholder name is required";
      if (!formData.cardNumber || formData.cardNumber.length !== 16)
        newErrors.cardNumber = "Valid card number is required";
      if (!formData.expiryMonth)
        newErrors.expiryMonth = "Expiry month is required";
      if (!formData.expiryYear)
        newErrors.expiryYear = "Expiry year is required";
      if (!formData.cvc || formData.cvc.length !== 3)
        newErrors.cvc = "Valid CVC is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (step === "address") {
        setStep("payment");
      } else {
        toast.success(`Order placed successfully!`);
        dispatch(clearCart());
      }
    }
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

    console.log("Order Details:", orderDetails);

    dispatch(addOrder(orderDetails));
    navigate("/orders");
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
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block mb-2 font-medium">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-2 font-medium">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 font-medium">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm">{errors.address}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block mb-2 font-medium">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-2 font-medium">Zipcode</label>
                      <input
                        type="text"
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                      {errors.zipcode && (
                        <p className="text-red-500 text-sm">{errors.zipcode}</p>
                      )}
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block mb-2 font-medium">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select Country</option>
                      <option value="IND">India</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                    {errors.country && (
                      <p className="text-red-500 text-sm">{errors.country}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white p-2 rounded-lg"
                  >
                    Continue to Payment
                  </button>
                </form>
              )}

              {step === "payment" && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block mb-2 font-medium">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    {errors.cardholderName && (
                      <p className="text-red-500 text-sm">
                        {errors.cardholderName}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 font-medium">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      maxLength={16}
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-sm">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block mb-2 font-medium">
                        Expiry Month
                      </label>
                      <select
                        name="expiryMonth"
                        value={formData.expiryMonth}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Month</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      {errors.expiryMonth && (
                        <p className="text-red-500 text-sm">
                          {errors.expiryMonth}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-2 font-medium">
                        Expiry Year
                      </label>
                      <select
                        name="expiryYear"
                        value={formData.expiryYear}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 10 }, (_, i) => (
                          <option key={i} value={new Date().getFullYear() + i}>
                            {new Date().getFullYear() + i}
                          </option>
                        ))}
                      </select>
                      {errors.expiryYear && (
                        <p className="text-red-500 text-sm">
                          {errors.expiryYear}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-2 font-medium">CVC</label>
                      <input
                        type="text"
                        name="cvc"
                        value={formData.cvc}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        maxLength={3}
                      />
                      {errors.cvc && (
                        <p className="text-red-500 text-sm">{errors.cvc}</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white p-2 rounded-lg"
                    onClick={handlePayment}
                  >
                    Pay with Card
                  </button>
                </form>
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