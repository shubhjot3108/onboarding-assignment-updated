import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Orders from "../orders";

jest.mock("../../shared/headerComponent", () => ({
  __esModule: true,
  default: ({ currentComponent, cartCount }) => (
    <div>
      <h1>{currentComponent}</h1>
      <p>Cart Count: {cartCount}</p>
    </div>
  ),
}));

jest.mock("../../shared/useProductDetails", () => ({
  __esModule: true,
  default: () => ({
    totalQuantity: 3,
  }),
}));

describe("Orders Component", () => {
  const mockStore = configureStore([]);

  const renderWithStore = (store) =>
    render(
      <Provider store={store}>
        <Orders />
      </Provider>
    );

  it("displays message when there are no orders", () => {
    const store = mockStore({ orders: { orders: [] } });
    renderWithStore(store);

    expect(
      screen.getByText(/You have not placed any order yet!/i)
    ).toBeInTheDocument();
  });

  it("renders a table with order details when orders are present", () => {
    const mockOrders = [
      {
        orderNo: "12345",
        customerName: "John Doe",
        paymentStatus: "Paid",
        amount: 250.0,
        address: "123 Main St, Anytown, USA",
        orderDate: "2023-12-25",
        status: "Shipped",
      },
      {
        orderNo: "67890",
        customerName: "Jane Smith",
        paymentStatus: "Pending",
        amount: 100.0,
        address: "456 Elm St, Othertown, USA",
        orderDate: "2023-12-26",
        status: "Processing",
      },
    ];

    const store = mockStore({ orders: { orders: mockOrders } });
    renderWithStore(store);

    expect(screen.getByText(/Order No\./i)).toBeInTheDocument();
    expect(screen.getByText(/Customer Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Payment Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByText(/Address/i)).toBeInTheDocument();
    expect(screen.getByText(/Order Date/i)).toBeInTheDocument();

    expect(screen.getByText(/12345/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Paid/i)).toBeInTheDocument();
    expect(screen.getByText(/123 Main St, Anytown, USA/i)).toBeInTheDocument();
    expect(screen.getByText(/2023-12-25/i)).toBeInTheDocument();
    expect(screen.getByText(/Shipped/i)).toBeInTheDocument();

    expect(screen.getByText(/67890/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending/i)).toBeInTheDocument();
    expect(screen.getByText(/456 Elm St, Othertown, USA/i)).toBeInTheDocument();
    expect(screen.getByText(/2023-12-26/i)).toBeInTheDocument();
    expect(screen.getByText(/Processing/i)).toBeInTheDocument();
  });
});
