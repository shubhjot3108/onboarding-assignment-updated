import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { BrowserRouter as Router } from "react-router-dom";
import MyCart from "../MyCart";
import { toast } from "react-toastify";


jest.mock("../../assets/productImage.webp", () => "placeholderImage.jpg");
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockStore = configureStore([]);
const mockCartItems = [
  {
    id: 1,
    image: "https://example.com/image1.jpg",
    title: "Product 1",
    price: 10.0,
    quantity: 2,
  },
  {
    id: 2,
    image: "https://example.com/image2.jpg",
    title: "Product 2",
    price: 20.0,
    quantity: 1,
  },
];

describe("MyCart Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      cart: {
        items: mockCartItems,
      },
    });
  });

  it("renders correctly", () => {
    render(
      <Provider store={store}>
        <Router>
          <MyCart />
        </Router>
      </Provider>
    );

    expect(screen.getByText(/Your Cart/i)).toBeInTheDocument();
    expect(screen.getByText(/Order Summary/i)).toBeInTheDocument();
  });

  it("displays empty cart message when there are no items", () => {
    store = mockStore({
      cart: {
        items: [],
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <MyCart />
        </Router>
      </Provider>
    );

    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  it("displays cart items correctly", () => {
    render(
      <Provider store={store}>
        <Router>
          <MyCart />
        </Router>
      </Provider>
    );

    mockCartItems.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
      expect(screen.getByText(`$${(item.price * item.quantity).toFixed(2)}`)).toBeInTheDocument();
    });
  });

  it("calculates subtotal correctly", () => {
    render(
      <Provider store={store}>
        <Router>
          <MyCart />
        </Router>
      </Provider>
    );

    const subtotal = mockCartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    expect(screen.getByText(`$${subtotal.toFixed(2)}`)).toBeInTheDocument();
  });

  it("enables/disables 'Continue to Checkout' button based on cart items", () => {
    const { rerender } = render(
      <Provider store={store}>
        <Router>
          <MyCart />
        </Router>
      </Provider>
    );

    expect(screen.getByText(/Continue to Checkout/i)).not.toBeDisabled();

    store = mockStore({
      cart: {
        items: [],
      },
    });

    rerender(
      <Provider store={store}>
        <Router>
          <MyCart />
        </Router>
      </Provider>
    );

    expect(screen.getByText(/Continue to Checkout/i)).toBeDisabled();
  });

  it("removes item from cart when 'Remove' button is clicked", () => {
    render(
      <Provider store={store}>
        <Router>
          <MyCart />
        </Router>
      </Provider>
    );

    const removeButtons = screen.getAllByText(/Remove/i);
    fireEvent.click(removeButtons[0]);

    expect(toast.error).toHaveBeenCalledWith(`${mockCartItems[0].title} removed from the cart!`);
  });
});
