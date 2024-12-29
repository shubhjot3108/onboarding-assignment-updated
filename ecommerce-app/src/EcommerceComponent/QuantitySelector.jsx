import React from "react";

const QuantitySelector = ({ quantity, onIncrement, onDecrement }) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <span className="text-gray-700 font-medium">Quantity</span>
      <div className="flex items-center">
        <button
          onClick={onDecrement}
          className="px-4 py-2 bg-gray-200 rounded-l-md hover:bg-gray-300"
          disabled={quantity <= 1}
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
          onClick={onIncrement}
          className="px-4 py-2 bg-gray-200 rounded-r-md hover:bg-gray-300"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;