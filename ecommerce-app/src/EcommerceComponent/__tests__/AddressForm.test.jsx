import React from "react"
import { render, screen, fireEvent } from "@testing-library/react";
import AddressForm from "../AddressForm";

describe("AddressForm", () => {
  const mockHandleSubmit = jest.fn();
  const defaultProps = {
    handleSubmit: mockHandleSubmit,
    nextButtonText: "Next",
  };

  beforeEach(() => {
    mockHandleSubmit.mockClear();
  });

  it("renders the form with all fields and submit button", () => {
    render(<AddressForm {...defaultProps} />);

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Zipcode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
    expect(screen.getByText(/Next/i)).toBeInTheDocument();
  });

  it("shows validation errors when required fields are empty", () => {
    render(<AddressForm {...defaultProps} />);

    fireEvent.click(screen.getByText(/Next/i));

    expect(screen.getByText(/First Name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Last Name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/City is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Zipcode is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Country is required/i)).toBeInTheDocument();
  });

  it("submits the form when all fields are valid", () => {
    render(<AddressForm {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { name: "firstName", value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { name: "lastName", value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Address/i), {
      target: { name: "address", value: "123 Main St" },
    });
    fireEvent.change(screen.getByLabelText(/City/i), {
      target: { name: "city", value: "Anytown" },
    });
    fireEvent.change(screen.getByLabelText(/Zipcode/i), {
      target: { name: "zipcode", value: "12345" },
    });
    fireEvent.change(screen.getByLabelText(/Country/i), {
      target: { name: "country", value: "US" },
    });

    fireEvent.click(screen.getByText(/Next/i));

    expect(mockHandleSubmit).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "Anytown",
      zipcode: "12345",
      country: "US",
    });
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it("does not submit the form when validation fails", () => {
    render(<AddressForm {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { name: "firstName", value: "" },
    });

    fireEvent.click(screen.getByText(/Next/i));

    expect(mockHandleSubmit).not.toHaveBeenCalled();
  });
});
