import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PaymentForm from "../PaymentForm";

describe("PaymentForm Component", () => {
  const mockHandlePayment = jest.fn();

  const renderComponent = () =>
    render(
      <PaymentForm handlePayment={mockHandlePayment} nextButtonText="Pay Now" />
    );

  it("renders form inputs and button", () => {
    renderComponent();

    expect(screen.getByLabelText(/Cardholder Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Card Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Expiry Month/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Expiry Year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CVC/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Pay Now/i })).toBeInTheDocument();
  });

  it("shows validation errors when form is submitted empty", () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /Pay Now/i }));

    expect(screen.getByText(/Cardholder name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Card number must be 16 digits/i)).toBeInTheDocument();
    expect(screen.getByText(/Expiry month is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Expiry year is required/i)).toBeInTheDocument();
    expect(screen.getByText(/CVC must be 3 digits/i)).toBeInTheDocument();
  });

  it("calls handlePayment with valid form data", () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Cardholder Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Card Number/i), {
      target: { value: "1234567812345678" },
    });
    fireEvent.change(screen.getByLabelText(/Expiry Month/i), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText(/Expiry Year/i), {
      target: { value: "2025" },
    });
    fireEvent.change(screen.getByLabelText(/CVC/i), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Pay Now/i }));

    expect(mockHandlePayment).toHaveBeenCalledWith({
      cardholderName: "John Doe",
      cardNumber: "1234567812345678",
      expiryMonth: "5",
      expiryYear: "2025",
      cvc: "123",
    });
  });

  it("does not call handlePayment with invalid form data", () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Card Number/i), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Pay Now/i }));
    expect(screen.getByText(/Card number must be 16 digits/i)).toBeInTheDocument();
  });
});
