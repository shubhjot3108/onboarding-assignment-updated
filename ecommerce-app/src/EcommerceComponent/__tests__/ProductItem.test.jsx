import React from "react";
import { render, screen } from "@testing-library/react";
import ProductItem from "../ProductItem";

jest.mock("../../assets/productImage.webp", () => "placeholderImage.jpg");
const mockProduct = {
  id: 1,
  image: "https://example.com/image.jpg",
  title: "Test Product",
  price: 29.99,
  rating: 4.5,
};

describe("ProductItem Component", () => {
  it("renders the product details correctly", () => {
    render(<ProductItem product={mockProduct} />);

    // Check for product title
    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();

    // Check for product price
    expect(screen.getByText(/\$29.99/)).toBeInTheDocument();

    // Check for product rating
    expect(screen.getByText(/Rating: 4.5/)).toBeInTheDocument();

    // Check if image is rendered with the correct src and alt
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", mockProduct.image);
    expect(image).toHaveAttribute("alt", mockProduct.title);
  });
});