export const getProductDetails = async (params) => {
    const {productId} = params;
    const url = `https://fake-ecommerce-app-api.onrender.com/products/${productId}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      throw error;
    }
  };