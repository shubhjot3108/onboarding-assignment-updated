import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import Checkout from "../CheckoutComponent";

jest.mock("../../shared/headerComponent", () => () => (
  <div>Mock HeaderComponent</div>
));
jest.mock("../../shared/useProductDetails", () => () => ({ totalQuantity: 2 }));
jest.mock("../../redux/ordersSlice", () => ({ addOrder: jest.fn() }));
jest.mock("../../redux/cartSlice", () => ({ clearCart: jest.fn() }));
jest.mock("../AddressForm", () => ({ handleSubmit }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({
        firstName: "John",
        lastName: "Doe",
        address: "123 St",
        city: "City",
        country: "Country",
        zipcode: "12345",
      });
    }}
  >
    <button type="submit">Mock AddressForm Submit</button>
  </form>
));
jest.mock("../PaymentForm", () => ({ handlePayment }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      handlePayment({
        cardholderName: "John Doe",
        cardNumber: "1234123412341234",
        expiryMonth: "01",
        expiryYear: "2025",
        cvc: "123",
      });
    }}
  >
    <button type="submit">Mock PaymentForm Submit</button>
  </form>
));

const mockStore = configureStore([]);
const initialState = {
  cart: { items: [{ title: "Item 1", quantity: 2, price: 10 }] },
  orders: { orders: [] },
};

const renderWithProviders = (ui, { store }) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe("Checkout Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it("renders the Checkout component with address form by default", () => {
    renderWithProviders(<Checkout />, { store });

    expect(screen.getByText("Mock HeaderComponent")).toBeInTheDocument();
    expect(screen.getByText("Checkout")).toBeInTheDocument();
    expect(screen.getByText("Your Cart")).toBeInTheDocument();
  });

  it("moves to payment step after address form submission", async () => {
    renderWithProviders(<Checkout />, { store });

    act(() => {
      fireEvent.click(screen.getByText("Mock AddressForm Submit"));
    });

    await waitFor(() => {
      expect(screen.getByText("Mock PaymentForm Submit")).toBeInTheDocument();
    });
  });

  it("displays cart items and calculates subtotal correctly", () => {
    renderWithProviders(<Checkout />, { store });

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Quantity: 2")).toBeInTheDocument();
    expect(screen.getByText("$10")).toBeInTheDocument();
  });
});