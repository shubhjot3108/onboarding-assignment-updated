export const getProductList = async (params) => {
    const { page, categoriesString, minPrice, maxPrice } = params;
    const categoryStringFinal = categoriesString ?categoriesString: "smartphones,laptops";
    const minPriceFinal = minPrice ? minPrice:0;
    const maxPriceFinal = maxPrice ?maxPrice: 5000;  
    console.log("categoryStringFinal", categoryStringFinal);
    const url = `https://fake-ecommerce-app-api.onrender.com/products?limit=4&page=${page}&category=${categoryStringFinal}&minPrice=${minPriceFinal}&maxPrice=${maxPriceFinal}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      throw error;
    }
  };  