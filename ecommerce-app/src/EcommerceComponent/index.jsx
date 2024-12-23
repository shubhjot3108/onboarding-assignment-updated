import { useEffect, useState } from "react";
import HeaderComponent from "../shared/headerComponent";
import MultiFilterComponent from "./MultiFilterComponent";
import ProductItem from "./ProductItem";
import { getProductList } from "../services/getproductList";
import { useNavigate } from "react-router-dom";
import useCartQuantities from "../shared/useCartQuantities";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../redux/filterSlice";

const ProductsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [productsData, setProductsData] = useState([]);
  const [showLoadMoreCTA, setShowLoadMoreCTA] = useState(false);
  const [currentPageValue, setCurrentPage] = useState(1);
  const [noProductsFound, setNoProductsFound] = useState(false);
  const [currentCategoryString, setCurrentCategoryString] = useState("");
  const [price, setPrice] = useState({ minPrice: 0, maxPrice: 5000 });
  const { totalQuantity } = useCartQuantities();

  const fetchProducts = async ({
    currentPageNumber = 1,
    categoriesString,
    minPrice,
    maxPrice,
  }) => {
    try {
      const response = await getProductList({
        page: currentPageNumber,
        categoriesString,
        minPrice,
        maxPrice,
      });
      const { currentPage, totalPages, products } = response;
      if (totalPages === 0) {
        setNoProductsFound(true);
        return;
      }
      setNoProductsFound(false);
      currentPageNumber > 1
        ? setProductsData((prevProducts) => [...prevProducts, ...products])
        : setProductsData(products);
      setCurrentPage(currentPage);
      setShowLoadMoreCTA(currentPage < totalPages);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setNoProductsFound(true);
    }
  };

  const handleFilterChange = (selectedFilters) => {
    dispatch(
      setFilters({
        Categories: selectedFilters.Categories,
        price: {
          minPrice: selectedFilters?.price.minPrice,
          maxPrice: selectedFilters?.price.maxPrice,
        },
      })
    );
    const categoriesString = selectedFilters.Categories.join(",");
    const minPriceUpdated = selectedFilters.price.minPrice;
    const maxPriceUpdated = selectedFilters.price.maxPrice;
    setProductsData([]);
    setCurrentCategoryString(categoriesString);
    setPrice({ minPrice: minPriceUpdated, maxPrice: maxPriceUpdated });
    fetchProducts({
      currentPageNumber: 1,
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

  const filtersRedux = useSelector((state) => state.filters.selectedFilters);
  useEffect(() => {
    if (
      filtersRedux.Categories.length > 0 ||
      filtersRedux.price.minPrice ||
      filtersRedux.price.maxPrice
    ) {
      const categoriesStringRedux = filtersRedux?.Categories.join(",");
      const minPriceUpdatedRedux = filtersRedux?.price.minPrice;
      const maxPriceUpdatedRedux = filtersRedux?.price.maxPrice;

      fetchProducts({
        currentPageNumber: 1,
        categoriesString: categoriesStringRedux,
        minPrice: minPriceUpdatedRedux,
        maxPrice: maxPriceUpdatedRedux,
      });
      setProductsData([]);
      setCurrentCategoryString(categoriesStringRedux);
      setPrice({
        minPrice: minPriceUpdatedRedux,
        maxPrice: maxPriceUpdatedRedux,
      });
    }
  }, []);

  return (
    <>
      <HeaderComponent currentComponent={"Home"} cartCount={totalQuantity} />
      <h1 className="text-2xl font-bold mb-6 mt-4">E-Commerce Shop App</h1>
      <div className="flex justify-between">
        <div className="mr-6">
          <MultiFilterComponent applyFilters={handleFilterChange} />
        </div>

        <div className="flex flex-col items-center h-[80vh] overflow-y-auto">
          {" "}
          {noProductsFound ? (
            <span className="text-[1.4rem] font-bold mt-[10rem] mr-[12rem] w-[24rem] text-center">
              No Product founds for this selection, Please change your selection
              and try again!
            </span>
          ) : (
            <div
              className="flex flex-wrap gap-4 scrollable-div"
              onClick={handleProductClick}
            >
              {productsData?.map((product) => (
                <div
                  className="product-card"
                  key={product.id}
                  data-id={product.id}
                >
                  <ProductItem
                    key={product.id}
                    product={product}
                    data-id={product.id}
                  />
                </div>
              ))}
            </div>
          )}
          {showLoadMoreCTA && (
            <button
              className=" w-[16rem] mt-[1.6rem] border-2 border-gray-500 text-black px-2 py-2 rounded hover:bg-gray-200"
              onClick={() =>
                fetchProducts({
                  currentPageNumber: currentPageValue + 1,
                  categoriesString: currentCategoryString,
                  minPrice: price?.minPrice,
                  maxPrice: price?.maxPrice,
                })
              }
            >
              Load more products
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
