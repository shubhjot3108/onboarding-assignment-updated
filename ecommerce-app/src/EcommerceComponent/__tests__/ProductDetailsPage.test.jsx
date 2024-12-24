import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ProductDetails from '../ProductDetailsPage';
import { getProductDetails } from '../../services/getProductDetails';
import { addToCart } from '../../redux/cartSlice';

jest.mock('../../services/getProductDetails');
jest.mock("../../assets/productImage.webp", () => "placeholderImage.jpg");

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn()
  }));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('ProductDetails Component', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
    getProductDetails.mockResolvedValue({
      title: 'Test Product',
      price: 100,
      description: 'Test product description',
    });
  });

  it('should render product details correctly', async () => {
    render(
      <Router>
        <ProductDetails />
      </Router>
    );
    await waitFor(() => screen.getByText('Test Product'));
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('Test product description')).toBeInTheDocument();
  });

  it('should handle quantity change correctly', async () => {
    render(
      <Router>
        <ProductDetails />
      </Router>
    );

    const incrementButton = screen.getByText('+');
    const decrementButton = screen.getByText('−');
    const quantityInput = screen.getByDisplayValue('1');

    // Increment quantity
    fireEvent.click(incrementButton);
    expect(quantityInput.value).toBe('2');

    // Decrement quantity
    fireEvent.click(decrementButton);
    expect(quantityInput.value).toBe('1');
  });

  it('should not decrement quantity below 1', async () => {
    render(
      <Router>
        <ProductDetails />
      </Router>
    );

    const decrementButton = screen.getByText('−');
    const quantityInput = screen.getByDisplayValue('1');

    // Attempt to decrement below 1
    fireEvent.click(decrementButton);
    expect(quantityInput.value).toBe('1');
  });

  it('should add the product to the cart and show a success toast', async () => {
    render(
      <Router>
        <ProductDetails />
      </Router>
    );
    await waitFor(() => screen.getByText('Test Product'));
    const addToCartButton = screen.getByText('Add to Cart - $100');
    fireEvent.click(addToCartButton);
    expect(dispatch).toHaveBeenCalledWith(
      addToCart({
        id: null,
        title: 'Test Product',
        price: 100,
        quantity: 1,
      })
    );
    expect(toast.success).toHaveBeenCalledWith('Test Product added to the cart!');
  });
});
