import React from 'react';
import { render } from '@testing-library/react';
import { useSelector } from 'react-redux'; 
import useCartQuantities from '../useCartQuantities';
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('useCartQuantities', () => {
  it('should return the correct total quantity and cart items', () => {
    const mockCartItems = [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 3 },
      { id: 3, quantity: 1 },
    ];
    useSelector.mockReturnValue(mockCartItems);
    const TestComponent = () => {
      const { totalQuantity, cartItems } = useCartQuantities();
      return (
        <div>
          <div data-testid="total-quantity">{totalQuantity}</div>
          <div data-testid="cart-items">{JSON.stringify(cartItems)}</div>
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('total-quantity').textContent).toBe('6');
  });

  it('should return totalQuantity as 0 if there are no items in the cart', () => {
    const mockCartItems = [];
    useSelector.mockReturnValue(mockCartItems);
    const TestComponent = () => {
      const { totalQuantity, cartItems } = useCartQuantities();
      return (
        <div>
          <div data-testid="total-quantity">{totalQuantity}</div>
          <div data-testid="cart-items">{JSON.stringify(cartItems)}</div>
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('total-quantity').textContent).toBe('0');
  });
});
