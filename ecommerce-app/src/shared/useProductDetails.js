import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getProductDetails } from "../services/getProductDetails";
import { useDispatch,useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";

const useProductDetails = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId");
  const [productDetails, setProductDetails] = useState({});
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = cartItems?.reduce((total, item) => total + item.quantity, 0);

  const fetchProductDetails = async (productIdKey) => {
    try {
      const response = await getProductDetails({ productId: productIdKey });
      console.log("Product Details:", response);
      setProductDetails(response);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const addToCartHandler = () => {
    dispatch(
      addToCart({
        id: productId,
        title: productDetails.title,
        price: productDetails.price,
        quantity: quantity,
      })
    );
    toast.success(`${productDetails.title} added to the cart!`);
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
    }
  }, [productId]);

  return {
    productDetails,
    quantity,
    setQuantity,
    addToCartHandler,
    totalQuantity,
  };
};

export default useProductDetails;