import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductDetails from "../ProductDetailsPage";
import useProductDetails from "../../shared/useProductDetails";

jest.mock("../../shared/useProductDetails");
jest.mock("../../shared/headerComponent", () => () => <div>HeaderComponent</div>);
jest.mock("../../assets/productImage.webp", () => "placeholderImage.jpg");

const mockProductDetails = {
  title: "Test Product",
  price: 100,
  description: "This is a test product."
};

const mockUseProductDetails = {
  productDetails: mockProductDetails,
  quantity: 1,
  setQuantity: jest.fn(),
  addToCartHandler: jest.fn(),
  totalQuantity: 2,
};

describe("ProductDetails Component", () => {
  beforeEach(() => {
    useProductDetails.mockReturnValue(mockUseProductDetails);
  });

  it("renders product details correctly", () => {
    render(<ProductDetails />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
    expect(screen.getByText("This is a test product.")).toBeInTheDocument();
    expect(screen.getByText("Free standard shipping")).toBeInTheDocument();
    expect(screen.getByText("Free Returns")).toBeInTheDocument();
  });

  it("renders the QuantitySelector and handles increment and decrement actions", () => {
    render(<ProductDetails />);

    const incrementButton = screen.getByText("+");
    const decrementButton = screen.getByText("−");

    fireEvent.click(incrementButton);
    expect(mockUseProductDetails.setQuantity).toHaveBeenCalled();

    fireEvent.click(decrementButton);
    expect(mockUseProductDetails.setQuantity).toHaveBeenCalled();
  });

  it("handles Add to Cart button click", () => {
    render(<ProductDetails />);

    const addToCartButton = screen.getByText(/Add to Cart/i);
    fireEvent.click(addToCartButton);

    expect(mockUseProductDetails.addToCartHandler).toHaveBeenCalled();
  });

  it("displays the correct total price on the Add to Cart button", () => {
    render(<ProductDetails />);

    expect(screen.getByText("Add to Cart - $100")).toBeInTheDocument();
  });

  it("renders the HeaderComponent with the correct cart count", () => {
    render(<ProductDetails />);

    expect(screen.getByText("HeaderComponent")).toBeInTheDocument();
  });
});
