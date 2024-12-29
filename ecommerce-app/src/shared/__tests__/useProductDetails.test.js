import React from "react";
import { render, screen, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, useLocation } from "react-router-dom";
import useProductDetails from "../useProductDetails";
import { getProductDetails } from "../../services/getProductDetails";
import { addToCart } from "../../redux/cartSlice";
import configureStore from "redux-mock-store";

jest.mock("../../services/getProductDetails");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

const mockStore = configureStore([]);
const HookWrapper = () => {
  const {
    productDetails,
    quantity,
    setQuantity,
    addToCartHandler,
    totalQuantity,
  } = useProductDetails();

  return (
    <div>
      <div data-testid="product-details">{JSON.stringify(productDetails)}</div>
      <div data-testid="quantity">{quantity}</div>
      <div data-testid="total-quantity">{totalQuantity}</div>
      <button onClick={() => setQuantity(2)} data-testid="set-quantity">
        Set Quantity
      </button>
      <button onClick={addToCartHandler} data-testid="add-to-cart">
        Add to Cart
      </button>
    </div>
  );
};

const customRender = (store) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <HookWrapper />
      </MemoryRouter>
    </Provider>
  );
};

describe("useProductDetails Hook", () => {
  let store;
  beforeEach(() => {
    useLocation.mockReturnValue({
      search: "?productId=123",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with correct default values", () => {
    store = mockStore({
      cart: {
        items: [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 3 },
        ],
      },
    });

    customRender(store);

    expect(screen.getByTestId("product-details").textContent).toBe("{}");
    expect(screen.getByTestId("quantity").textContent).toBe("1");
    expect(screen.getByTestId("total-quantity").textContent).toBe("5");
  });

  it("should fetch product details on productId change", async () => {
    store = mockStore({
      cart: {
        items: [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 3 },
        ],
      },
    });
    getProductDetails.mockResolvedValue({ id: 123, title: "Sample Product" });

    await act(async () => {
      customRender(store);
    });

    expect(getProductDetails).toHaveBeenCalledWith({ productId: "123" });
    expect(screen.getByTestId("product-details").textContent).toContain(
      "Sample Product"
    );
  });

  it("should handle API errors gracefully", async () => {
    store = mockStore({
      cart: {
        items: [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 3 },
        ],
      },
    });
    getProductDetails.mockRejectedValue(new Error("API error"));

    await act(async () => {
      customRender(store);
    });

    expect(getProductDetails).toHaveBeenCalledWith({ productId: "123" });
    expect(screen.getByTestId("product-details").textContent).toBe("{}");
  });

  it("should allow quantity to be updated", () => {
    store = mockStore({
      cart: {
        items: [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 3 },
        ],
      },
    });
    customRender(store);

    act(() => {
      screen.getByTestId("set-quantity").click();
    });

    expect(screen.getByTestId("quantity").textContent).toBe("2");
  });

  it("should dispatch addToCart action with correct payload", async () => {
    store = mockStore({
      cart: {
        items: [
          { id: 1, quantity: 2, title: "Sample Product1", price: 100 },
          { id: 2, quantity: 3, title: "Sample Product2", price: 200 },
        ],
      },
    });
    const mockDispatch = jest.fn();
    store.dispatch = mockDispatch;

    getProductDetails.mockResolvedValue({
      id: 123,
      title: "Sample Product",
      price: 500,
    });

    await act(async () => {
      customRender(store);
    });

    act(() => {
      screen.getByTestId("add-to-cart").click();
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      addToCart({
        id: "123",
        title: "Sample Product",
        price: 500,
        quantity: 1,
      })
    );
  });
});