import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../shared/headerComponent";
import { toast } from "react-toastify";
import PlaceHolderImage from "../assets/productImage.webp";
import useProductDetails from "../shared/useProductDetails";

const MyCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const { totalQuantity } = useProductDetails();
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const handleRemoveItem = (item) => {
    dispatch(removeFromCart(item?.id));
    toast.error(`${item.title} removed from the cart!`);
  };

  const goToCheckout = () => {
    navigate(`/checkout`);
  };

  return (
    <>
      <HeaderComponent currentComponent={"My Cart"} cartCount={totalQuantity} />

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
            <p className="mb-6 text-gray-500">
              Not ready to checkout?{" "}
              <a href="/" className="text-blue-500">
                Continue Shopping
              </a>
            </p>
            {cartItems.length ? (
              cartItems.map(({ id, image, title, size, quantity, price }) => (
                <div key={id} className="flex items-center border-b py-4">
                  <div className="w-24 h-24 bg-gray-300 rounded-md">
                    <img
                      src={image || PlaceHolderImage}
                      alt={title}
                      className="w-full h-full object-cover rounded-md"
                      onError={(e) => {
                        e.target.src = PlaceHolderImage;
                      }}
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <p className="text-sm text-gray-500">
                      Size: {size || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {quantity}
                    </p>
                    <p className="text-lg font-bold mt-2">
                      ${price * quantity}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <button
                      onClick={() =>
                        handleRemoveItem({
                          id,
                          image,
                          title,
                          size,
                          quantity,
                          price,
                        })
                      }
                      className="text-blue-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[1.4rem] text-gray-500">Your cart is empty</p>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <input
              type="text"
              placeholder="Enter coupon code here"
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
            />
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Subtotal</span>
              <span className="font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Shipping</span>
              <span className="text-gray-500">Calculated at the next step</span>
            </div>
            <div className="flex justify-between border-t pt-4">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg">${subtotal.toFixed(2)}</span>
            </div>
            <button
              className={`font-bold py-3 rounded-md w-full mt-4 ${
                cartItems.length === 0
                  ? "bg-gray-300 text-gray-500"
                  : "bg-black text-white"
              }`}
              onClick={goToCheckout}
              disabled={cartItems.length === 0}
            >
              Continue to Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyCart;
