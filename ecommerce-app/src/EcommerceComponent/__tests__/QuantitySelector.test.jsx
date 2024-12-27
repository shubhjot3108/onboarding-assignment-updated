import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QuantitySelector from "../QuantitySelector";

describe("QuantitySelector Component", () => {
  test("renders correctly with initial quantity", () => {
    render(
      <QuantitySelector quantity={5} onIncrement={jest.fn()} onDecrement={jest.fn()} />
    );

    expect(screen.getByText(/Quantity/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("5")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "−" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+" })).toBeInTheDocument();
  });

  test("calls onIncrement when + button is clicked", () => {
    const onIncrement = jest.fn();
    render(
      <QuantitySelector quantity={5} onIncrement={onIncrement} onDecrement={jest.fn()} />
    );

    const incrementButton = screen.getByRole("button", { name: "+" });
    fireEvent.click(incrementButton);

    expect(onIncrement).toHaveBeenCalledTimes(1);
  });

  test("calls onDecrement when − button is clicked", () => {
    const onDecrement = jest.fn();
    render(
      <QuantitySelector quantity={5} onIncrement={jest.fn()} onDecrement={onDecrement} />
    );

    const decrementButton = screen.getByRole("button", { name: "−" });
    fireEvent.click(decrementButton);

    expect(onDecrement).toHaveBeenCalledTimes(1);
  });

  test("− button is disabled when quantity is 1", () => {
    render(
      <QuantitySelector quantity={1} onIncrement={jest.fn()} onDecrement={jest.fn()} />
    );

    const decrementButton = screen.getByRole("button", { name: "−" });
    expect(decrementButton).toBeDisabled();
  });

  test("+ button is enabled and functional", () => {
    const onIncrement = jest.fn();
    render(
      <QuantitySelector quantity={1} onIncrement={onIncrement} onDecrement={jest.fn()} />
    );

    const incrementButton = screen.getByRole("button", { name: "+" });
    expect(incrementButton).not.toBeDisabled();
    fireEvent.click(incrementButton);
    expect(onIncrement).toHaveBeenCalledTimes(1);
  });

  test("input value is read-only", () => {
    render(
      <QuantitySelector quantity={5} onIncrement={jest.fn()} onDecrement={jest.fn()} />
    );

    const input = screen.getByDisplayValue("5");
    expect(input).toHaveAttribute("readonly");
  });
});