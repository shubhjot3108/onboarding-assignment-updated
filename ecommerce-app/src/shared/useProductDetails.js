import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getProductDetails } from "../services/getProductDetails";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const useProductDetails = (productId) => {
  const [productDetails, setProductDetails] = useState({});
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

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
  };
};

export default useProductDetails;