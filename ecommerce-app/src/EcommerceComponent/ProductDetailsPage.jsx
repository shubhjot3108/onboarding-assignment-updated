import React from "react";
import useProductDetails from "../shared/useProductDetails";
import HeaderComponent from "../shared/headerComponent";
import PlaceHolderImage from "../assets/productImage.webp";
import QuantitySelector from "./QuantitySelector";

const ProductDetails = () => {
  const {
    productDetails,
    quantity,
    setQuantity,
    addToCartHandler,
    totalQuantity,
  } = useProductDetails();

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
          <h1 className="text-3xl font-bold mb-2">{productDetails.title}</h1>
          <p className="text-xl font-semibold mb-4">${productDetails.price}</p>

          <p className="text-gray-600 mb-4">{productDetails.description}</p>

          <QuantitySelector
            quantity={quantity}
            onIncrement={() => setQuantity(quantity + 1)}
            onDecrement={() => setQuantity(quantity - 1)}
          />

          <button
            className="bg-black text-white font-bold py-3 rounded-md w-full mb-4"
            onClick={addToCartHandler}
          >
            Add to Cart - ${productDetails.price * quantity}
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
