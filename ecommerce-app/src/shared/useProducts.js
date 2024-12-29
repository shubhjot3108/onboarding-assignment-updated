import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../redux/filterSlice";
import { getProductList } from "../services/getproductList";
import { useNavigate } from "react-router-dom";

const useProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const filtersRedux = useSelector((state) => state.filters.selectedFilters);
  const [productsData, setProductsData] = useState([]);
  const [showLoadMoreCTA, setShowLoadMoreCTA] = useState(false);
  const [currentPageValue, setCurrentPage] = useState(1);
  const [noProductsFound, setNoProductsFound] = useState(false);
  const [currentCategoryString, setCurrentCategoryString] = useState("");
  const [price, setPrice] = useState({ minPrice: 0, maxPrice: 5000 });

  const fetchProducts = useCallback(
    async ({ currentPageNumber = 1, categoriesString, minPrice, maxPrice }) => {
      try {
        const response = await getProductList({
          page: currentPageNumber,
          categoriesString,
          minPrice,
          maxPrice,
        });
        const { currentPage, totalPages, products } = response;
        setNoProductsFound(totalPages === 0);
        if (totalPages === 0) return;

        currentPageNumber > 1
          ? setProductsData((prevProducts) => [...prevProducts, ...products])
          : setProductsData(products);
        setCurrentPage(currentPage);
        setShowLoadMoreCTA(currentPage < totalPages);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        setNoProductsFound(true);
      }
    },
    []
  );

  const fetchProductsHandler = useCallback(
    ({ categoriesString, minPrice, maxPrice }) => {
      fetchProducts({
        currentPageNumber: 1,
        categoriesString,
        minPrice,
        maxPrice,
      });
      setProductsData([]);
      setCurrentCategoryString(categoriesString);
      setPrice({ minPrice, maxPrice });
    },
    [fetchProducts]
  );

  const handleFilterChange = (selectedFilters) => {
    dispatch(
      setFilters({
        Categories: selectedFilters.Categories,
        price: {
          minPrice: selectedFilters.price.minPrice,
          maxPrice: selectedFilters.price.maxPrice,
        },
      })
    );
    const categoriesString = selectedFilters?.Categories.join(",");
    const minPriceUpdated = selectedFilters?.price.minPrice;
    const maxPriceUpdated = selectedFilters?.price.maxPrice;

    fetchProductsHandler({
      categoriesString,
      minPrice: minPriceUpdated,
      maxPrice: maxPriceUpdated,
    });
  };

  const handleProductClick = (e) => {
    const wrappingDiv = e.target.closest(".product-card");
    if (wrappingDiv) {
      const productId = wrappingDiv.getAttribute("data-id");
      if (productId) {
        console.log("Clicked Product ID:", productId);
        navigate(`/productDetails?productId=${productId}`);
      }
    } else {
      console.log("No wrapping div found!");
    }
  };

  useEffect(() => {
    if (
      filtersRedux.Categories.length > 0 ||
      filtersRedux.price.minPrice ||
      filtersRedux.price.maxPrice
    ) {
      const categoriesStringRedux = filtersRedux?.Categories.join(",");
      const minPriceUpdatedRedux = filtersRedux.price.minPrice;
      const maxPriceUpdatedRedux = filtersRedux.price.maxPrice;

      fetchProductsHandler({
        categoriesString: categoriesStringRedux,
        minPrice: minPriceUpdatedRedux,
        maxPrice: maxPriceUpdatedRedux,
      });
    }
  }, []);

  return {
    productsData,
    showLoadMoreCTA,
    noProductsFound,
    currentPageValue,
    fetchProducts,
    fetchProductsHandler,
    handleFilterChange,
    handleProductClick,
    setCurrentPage,
    price,
    setPrice,
    currentCategoryString,
    setCurrentCategoryString,
  };
};

export default useProducts;