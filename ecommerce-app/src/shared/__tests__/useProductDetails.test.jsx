import React from "react";
import { render, act } from "@testing-library/react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import useProductDetails from "../useProductDetails";
import { getProductDetails } from "../../services/getProductDetails";
import { addToCart } from "../../redux/cartSlice";
import { wait } from "@testing-library/user-event/dist/cjs/utils/index.js";

jest.mock("../../services/getProductDetails");
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
  },
}));
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

describe("useProductDetails", () => {
  const mockDispatch = jest.fn();
  const mockProduct = {
    title: "Test Product",
    price: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getProductDetails.mockResolvedValue(mockProduct);
    useDispatch.mockReturnValue(mockDispatch);
  });

  const TestComponent = () => {
    const { productDetails, addToCartHandler } = useProductDetails(1);

    return (
      <div>
        <h1>{productDetails.title}</h1>
        <p>{productDetails.price}</p>
        <button onClick={addToCartHandler}>Add to Cart</button>
      </div>
    );
  };

  it("should fetch product details and set them correctly", async () => {
    const { findByText } = render(<TestComponent />);
    const title = await findByText(mockProduct.title);
    const price = await findByText(mockProduct.price);
    expect(title).toBeInTheDocument();
    expect(price).toBeInTheDocument();
  });

  it("should dispatch addToCart action and show toast on addToCartHandler call", async () => {
    const { getByText } = render(<TestComponent />);
    const button = getByText("Add to Cart");
    act(() => {
      button.click();
    });

    wait(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        addToCart({
          id: 1,
          title: mockProduct.title,
          price: mockProduct.price,
          quantity: 1,
        })
      );
      expect(toast.success).toHaveBeenCalledWith(
        `${mockProduct.title} added to the cart!`
      );
    });
  });
});
