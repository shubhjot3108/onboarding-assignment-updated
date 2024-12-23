import { useSelector } from "react-redux";

const useCartQuantities = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  return {
    totalQuantity,
    cartItems,
  };
};

export default useCartQuantities;