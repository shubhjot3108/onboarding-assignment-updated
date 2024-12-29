import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import HeaderComponent from "../headerComponent";
import { useNavigate } from "react-router-dom";
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("HeaderComponent", () => {
  let navigate;

  beforeEach(() => {
    navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    render(<HeaderComponent currentComponent="Home" cartCount={5} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("My Orders")).toBeInTheDocument();
    expect(screen.getByText("My Cart (5)")).toBeInTheDocument();
  });

  it("should navigate to correct route when Home is clicked", () => {
    render(<HeaderComponent currentComponent="Home" cartCount={0} />);

    fireEvent.click(screen.getByText("Home"));
    expect(navigate).toHaveBeenCalledWith("/");
  });

  it("should navigate to correct route when My Orders is clicked", () => {
    render(<HeaderComponent currentComponent="My Orders" cartCount={0} />);

    fireEvent.click(screen.getByText("My Orders"));
    expect(navigate).toHaveBeenCalledWith("/orders");
  });

  it("should navigate to correct route when My Cart is clicked", () => {
    render(<HeaderComponent currentComponent="My Cart" cartCount={0} />);

    fireEvent.click(screen.getByText("My Cart (0)"));
    expect(navigate).toHaveBeenCalledWith("/cart");
  });

  it('should apply the "font-bold" class for the active component', () => {
    render(<HeaderComponent currentComponent="My Orders" cartCount={0} />);

    expect(screen.getByText("My Orders")).toHaveClass("font-bold");
    expect(screen.getByText("Home")).not.toHaveClass("font-bold");
    expect(screen.getByText("My Cart (0)")).not.toHaveClass("font-bold");
  });

  it("should display the correct cart count", () => {
    render(
      <Router>
        <HeaderComponent currentComponent="Home" cartCount={3} />
      </Router>
    );

    expect(screen.getByText("My Cart (3)")).toBeInTheDocument();
  });
});
