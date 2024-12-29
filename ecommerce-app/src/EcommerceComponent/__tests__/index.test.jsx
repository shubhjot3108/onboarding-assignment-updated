import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductsPage from "../index";
import useProducts from "../../shared/useProducts";
import useProductDetails from "../../shared/useProductDetails";

jest.mock("../../shared/useProducts");
jest.mock("../../shared/useProductDetails");
jest.mock("../../shared/headerComponent", () => () => <div>Mocked HeaderComponent</div>);
jest.mock("../MultiFilterComponent", () => (props) => (
  <div>
    Mocked MultiFilterComponent
    <button onClick={() => props.applyFilters({})}>Apply Filters</button>
  </div>
));
jest.mock("../ProductItem", () => ({ product }) => <div>{product.title}</div>);

describe("ProductsPage Component", () => {
  const mockFetchProducts = jest.fn();
  const mockHandleFilterChange = jest.fn();
  const mockHandleProductClick = jest.fn();

  beforeEach(() => {
    useProducts.mockReturnValue({
      productsData: [
        { id: 1, title: "Product 1" },
        { id: 2, title: "Product 2" },
      ],
      showLoadMoreCTA: true,
      noProductsFound: false,
      currentPageValue: 1,
      fetchProducts: mockFetchProducts,
      handleFilterChange: mockHandleFilterChange,
      handleProductClick: mockHandleProductClick,
      price: { minPrice: 10, maxPrice: 100 },
      currentCategoryString: "category1",
    });
    useProductDetails.mockReturnValue({
      totalQuantity: 5,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the ProductsPage component", () => {
    render(<ProductsPage />);
    expect(screen.getByText("E-Commerce Shop App")).toBeInTheDocument();
    expect(screen.getByText("Mocked HeaderComponent")).toBeInTheDocument();
    expect(screen.getByText("Mocked MultiFilterComponent")).toBeInTheDocument();
  });

  it("displays products", () => {
    render(<ProductsPage />);
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
  });

  it("displays the 'Load more products' button and triggers fetch on click", () => {
    render(<ProductsPage />);
    const loadMoreButton = screen.getByText("Load more products");
    expect(loadMoreButton).toBeInTheDocument();

    fireEvent.click(loadMoreButton);
    expect(mockFetchProducts).toHaveBeenCalledWith({
      currentPageNumber: 2,
      categoriesString: "category1",
      minPrice: 10,
      maxPrice: 100,
    });
  });

  it("handles no products found", () => {
    useProducts.mockReturnValueOnce({
      ...useProducts(),
      productsData: [],
      noProductsFound: true,
    });
    render(<ProductsPage />);
    expect(screen.getByText(/No Product found for this selection/i)).toBeInTheDocument();
  });

  it("handles filter change correctly", () => {
    render(<ProductsPage />);
    const applyFiltersButton = screen.getByText("Apply Filters");
    fireEvent.click(applyFiltersButton);
    expect(mockHandleFilterChange).toHaveBeenCalled();
  });

  it("handles product click correctly", () => {
    render(<ProductsPage />);
    const productCard = screen.getByText("Product 1");
    fireEvent.click(productCard);
    expect(mockHandleProductClick).toHaveBeenCalled();
  });
});
