import React, { useEffect } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import useProducts from "../useProducts";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import { getProductList } from "../../services/getproductList";
import { useNavigate } from "react-router-dom";

jest.mock("../../services/getproductList");
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
  },
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const mockStore = configureStore();

const HookWrapper = ({ filters = null }) => {
  const { productsData, handleFilterChange, handleProductClick } =
    useProducts();

  useEffect(() => {
    if (filters) {
      handleFilterChange(filters);
    }
  }, []);

  return (
    <div data-testid="product-list">
      {productsData?.map((product) => (
        <div
          key={product.id}
          className="product-card"
          data-id={product.id}
          onClick={handleProductClick}
        >
          {product.title}
        </div>
      ))}
    </div>
  );
};

const renderWithProviders = (ui, { store, filters = null }) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{React.cloneElement(ui, { filters })}</MemoryRouter>
    </Provider>
  );
};

const initialState = {
  filters: {
    selectedFilters: {
      Categories: ["Category1", "Category2"],
      price: {
        minPrice: 10,
        maxPrice: 100,
      },
    },
  },
};

describe("useProducts Hook", () => {
  let mockNavigate;
  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    getProductList.mockResolvedValue({
      currentPage: 1,
      totalPages: 3,
      products: [{ id: 1, title: "Product1" }],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with correct default values", () => {
    const store = mockStore(initialState);

    renderWithProviders(<HookWrapper />, { store });

    expect(screen.getByTestId("product-list")).toBeInTheDocument();
  });

  it("should fetch products successfully on initial load", async () => {
    const store = mockStore(initialState);

    renderWithProviders(<HookWrapper />, { store });

    await waitFor(() => expect(getProductList).toHaveBeenCalledTimes(1));
    expect(screen.getByText("Product1")).toBeInTheDocument();
  });

  it("should handle no products found", async () => {
    getProductList.mockResolvedValueOnce({
      currentPage: 1,
      totalPages: 0,
      products: [],
    });

    const store = mockStore(initialState);

    renderWithProviders(<HookWrapper />, { store });

    await waitFor(() => expect(getProductList).toHaveBeenCalledTimes(1));
    expect(screen.queryByText("Product1")).toBeNull();
  });

  it("should apply filters and fetch products with new filters", async () => {
    const newFilters = {
      Categories: ["NewCategory"],
      price: { minPrice: 20, maxPrice: 200 },
    };

    getProductList.mockResolvedValue({
      currentPage: 1,
      totalPages: 2,
      products: [{ id: 2, title: "Filtered Product" }],
    });

    const store = mockStore(initialState);

    renderWithProviders(<HookWrapper />, { store, filters: newFilters });

    await waitFor(() =>
      expect(getProductList).toHaveBeenCalledWith({
        page: 1,
        categoriesString: "NewCategory",
        minPrice: 20,
        maxPrice: 200,
      })
    );

    expect(screen.getByText("Filtered Product")).toBeInTheDocument();
  });

  it("should handle product click and navigate to product details page", async () => {
    const store = mockStore(initialState);
    const newFilters = {
      Categories: ["NewCategory"],
      price: { minPrice: 20, maxPrice: 200 },
    };

    renderWithProviders(<HookWrapper />, { store, filters: newFilters });

    await waitFor(() =>
      expect(screen.getByText("Product1")).toBeInTheDocument()
    );

    const productCard = screen.getByText("Product1").closest(".product-card");
    fireEvent.click(productCard);

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/productDetails?productId=1")
    );
  });
});
