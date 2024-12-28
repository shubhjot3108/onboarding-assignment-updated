import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MultiFilterComponent from "../MultiFilterComponent";
import { getProductCategories } from "../../services/getAllProductCategories";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

jest.mock("../../services/getAllProductCategories");

const mockStore = configureStore([]);
const initialState = {
  filters: {
    selectedFilters: {
      Categories: [],
      price: { minPrice: "", maxPrice: "" },
    },
  },
};

describe("MultiFilterComponent", () => {
  let store;
  const mockApplyFilters = jest.fn();

  beforeEach(() => {
    store = mockStore(initialState);
    jest.clearAllMocks();
  });

  it("renders the component with initial elements", () => {
    render(
      <Provider store={store}>
        <MultiFilterComponent applyFilters={mockApplyFilters} />
      </Provider>
    );

    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Clear Filters")).toBeInTheDocument();
    expect(screen.getByText("Price Range")).toBeInTheDocument();
    expect(screen.getByText("Apply Filters")).toBeInTheDocument();
  });

  it("fetches and displays categories", async () => {
    const mockCategories = ["Electronics", "Clothing", "Books"];
    getProductCategories.mockResolvedValueOnce(mockCategories);

    render(
      <Provider store={store}>
        <MultiFilterComponent applyFilters={mockApplyFilters} />
      </Provider>
    );

    await waitFor(() => {
      expect(getProductCategories).toHaveBeenCalledTimes(1);
    });

    mockCategories.forEach((category) => {
      expect(screen.getByLabelText(category)).toBeInTheDocument();
    });
  });

  it("handles filter selection", async () => {
    const mockCategories = ["Electronics", "Clothing"];
    getProductCategories.mockResolvedValueOnce(mockCategories);

    render(
      <Provider store={store}>
        <MultiFilterComponent applyFilters={mockApplyFilters} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Electronics")).toBeInTheDocument();
    });

    const electronicsCheckbox = screen.getByLabelText("Electronics");
    fireEvent.click(electronicsCheckbox);

    expect(electronicsCheckbox).toBeChecked();
  });

  it("clears filters", async () => {
    const mockCategories = ["Electronics", "Clothing"];
    getProductCategories.mockResolvedValueOnce(mockCategories);

    render(
      <Provider store={store}>
        <MultiFilterComponent applyFilters={mockApplyFilters} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Electronics")).toBeInTheDocument();
    });

    const electronicsCheckbox = screen.getByLabelText("Electronics");
    fireEvent.click(electronicsCheckbox);

    const clearFiltersButton = screen.getByText("Clear Filters");
    fireEvent.click(clearFiltersButton);
    expect(electronicsCheckbox).not.toBeChecked();
    expect(mockApplyFilters).not.toHaveBeenCalled();
  });
});
