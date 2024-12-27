import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import MyCart from "../MyCart";

jest.mock("../../assets/productImage.webp", () => "placeholderImage.jpg");

describe("MyCart Component", () => {
  const mockStore = configureStore([]);
  let store;

  beforeEach(() => {
    store = mockStore({
      cart: {
        items: [
          {
            id: 1,
            title: "Product 1",
            price: 20,
            quantity: 2,
            image: "image1.jpg",
            size: "M",
          },
          {
            id: 2,
            title: "Product 2",
            price: 15,
            quantity: 1,
            image: "image2.jpg",
            size: "L",
          },
        ],
      },
    });
  });

  const renderWithProviders = (ui) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>{ui}</BrowserRouter>
      </Provider>
    );
  };

  it("renders the cart items and totals correctly", () => {
    renderWithProviders(<MyCart />);

    expect(screen.getByText("Your Cart")).toBeInTheDocument();
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
    expect(screen.getByText("$40")).toBeInTheDocument();
    expect(screen.getByText("$15")).toBeInTheDocument();
  });


  it("disables the checkout button when the cart is empty", () => {
    store = mockStore({
      cart: {
        items: [],
      },
    });

    renderWithProviders(<MyCart />);

    const checkoutButton = screen.getByText("Continue to Checkout");
    expect(checkoutButton).toBeDisabled();
    expect(checkoutButton).toHaveClass("bg-gray-300 text-gray-500");
  });

  it("renders a message when the cart is empty", () => {
    store = mockStore({
      cart: {
        items: [],
      },
    });

    renderWithProviders(<MyCart />);

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });
});