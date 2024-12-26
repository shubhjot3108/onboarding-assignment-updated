import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { getProductDetails } from "../services/getProductDetails";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import useCartQuantities from "../shared/useCartQuantities";
import HeaderComponent from "../shared/headerComponent";
import PlaceHolderImage from '../assets/productImage.webp';

const ProductDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId");
  const [productDetails, setProductDetails] = useState({});
  const [quantity, setQuantity] = useState(1);
  const { totalQuantity } = useCartQuantities();

  const getProductDetailsHandler = async (productIdKey) => {
    try {
      const response = await getProductDetails({ productId: productIdKey });
      console.log("Product Details:", response);
      setProductDetails(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity(quantity + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: productId,
        title: productDetails.title,
        price: productDetails.price,
        quantity: quantity,
      })
    );
    toast.success(`${productDetails.title} added to the cart!`);
  };

  useEffect(() => {
    getProductDetailsHandler(productId);
  }, []);

  return (
    <>
      <HeaderComponent currentComponent={"Website"} cartCount={totalQuantity} />

      <div className="flex flex-row lg:flex-row gap-8 p-6">
        <div className="w-full h-80 lg:w-1/2 bg-gray-300">
          <img
            className="w-full h-full object-fit rounded-md"
            src={PlaceHolderImage}
            alt={productDetails.title}
          />
        </div>

        <div className="w-full lg:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{productDetails?.title}</h1>
          <p className="text-xl font-semibold mb-4">${productDetails?.price}</p>

          <p className="text-gray-600 mb-4">{productDetails?.description}</p>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-gray-700 font-medium">Quantity</span>
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange("decrement")}
                className="px-4 py-2 bg-gray-200 rounded-l-md hover:bg-gray-300"
              >
                −
              </button>
              <input
                type="text"
                readOnly
                value={quantity}
                className="w-12 text-center border-t border-b border-gray-300"
              />
              <button
                onClick={() => handleQuantityChange("increment")}
                className="px-4 py-2 bg-gray-200 rounded-r-md hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          <button
            className="bg-black text-white font-bold py-3 rounded-md w-full mb-4"
            onClick={handleAddToCart}
          >
            Add to Cart - ${productDetails?.price * quantity}
          </button>

          <div className="flex justify-between text-gray-500 text-sm">
            <span>Free standard shipping</span>
            <span>Free Returns</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
