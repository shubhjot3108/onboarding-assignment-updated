import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Orders from "../orders";
import useCartQuantities from "../../shared/useCartQuantities";

jest.mock("../../shared/useCartQuantities");
jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
}));

const mockStore = configureStore([]);
describe("Orders Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      orders: {
        orders: [],
      },
    });
    useCartQuantities.mockReturnValue({ totalQuantity: 0 });
  });

  it("renders correctly", () => {
    render(
      <Provider store={store}>
        <Orders />
      </Provider>
    );

    expect(screen.getByText(/My Orders/i)).toBeInTheDocument();
  });

  it("displays empty orders message when there are no orders", () => {
    render(
      <Provider store={store}>
        <Orders />
      </Provider>
    );

    expect(screen.getByText(/You have not placed any order yet!/i)).toBeInTheDocument();
  });

  it("displays orders table correctly when there are orders", () => {
    store = mockStore({
      orders: {
        orders: [
          {
            orderNo: "12345",
            customerName: "John Doe",
            paymentStatus: "Paid",
            amount: 100.0,
            address: "123 Main St",
            orderDate: "2023-10-01",
            status: "Delivered",
          },
        ],
      },
    });

    render(
      <Provider store={store}>
        <Orders />
      </Provider>
    );

    expect(screen.getByText(/Order No./i)).toBeInTheDocument();
    expect(screen.getByText(/Customer Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Payment Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByText(/Address/i)).toBeInTheDocument();
    expect(screen.getByText(/Order Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();

    expect(screen.getByText("12345")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    expect(screen.getByText("2023-10-01")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
  });
});