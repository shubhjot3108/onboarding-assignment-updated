import React from "react";
import PlaceHolderImage from "../assets/productImage.webp";
const ProductItem = ({ product }) => {
  return (
    <div
      className="product-card bg-gray-100 p-4 w-[18rem] h-[20rem] rounded-md shadow-md cursor-pointer"
      data-id={product.id}
    >
      <div className="bg-gray-300 w-full h-48 rounded-md mb-4">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover rounded-md"
          onError={(e) => {
            e.target.src = PlaceHolderImage;
          }}
        />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
        {product.title}
      </h3>{" "}
      <p className="text-gray-600 text-md">${product.price}</p>
      <p className="text-gray-600 text-md">{`Rating: ${product.rating} ⭐`}</p>
    </div>
  );
};

export default ProductItem;