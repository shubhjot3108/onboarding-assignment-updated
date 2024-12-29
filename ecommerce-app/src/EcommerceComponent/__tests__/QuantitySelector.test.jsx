import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QuantitySelector from "../QuantitySelector";

describe("QuantitySelector Component", () => {
  it("renders correctly with initial quantity", () => {
    render(
      <QuantitySelector quantity={5} onIncrement={jest.fn()} onDecrement={jest.fn()} />
    );

    expect(screen.getByText(/Quantity/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("5")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "−" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+" })).toBeInTheDocument();
  });

  it("calls onIncrement when + button is clicked", () => {
    const onIncrement = jest.fn();
    render(
      <QuantitySelector quantity={5} onIncrement={onIncrement} onDecrement={jest.fn()} />
    );

    const incrementButton = screen.getByRole("button", { name: "+" });
    fireEvent.click(incrementButton);

    expect(onIncrement).toHaveBeenCalledTimes(1);
  });

  it("calls onDecrement when − button is clicked", () => {
    const onDecrement = jest.fn();
    render(
      <QuantitySelector quantity={5} onIncrement={jest.fn()} onDecrement={onDecrement} />
    );

    const decrementButton = screen.getByRole("button", { name: "−" });
    fireEvent.click(decrementButton);

    expect(onDecrement).toHaveBeenCalledTimes(1);
  });

  it("− button is disabled when quantity is 1", () => {
    render(
      <QuantitySelector quantity={1} onIncrement={jest.fn()} onDecrement={jest.fn()} />
    );

    const decrementButton = screen.getByRole("button", { name: "−" });
    expect(decrementButton).toBeDisabled();
  });
});