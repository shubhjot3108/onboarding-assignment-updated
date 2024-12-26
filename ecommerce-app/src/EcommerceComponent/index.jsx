import { useNavigate } from "react-router-dom";
import HeaderComponent from "../shared/headerComponent";
import MultiFilterComponent from "./MultiFilterComponent";
import ProductItem from "./ProductItem";
import useCartQuantities from "../shared/useCartQuantities";
import useProducts from "../shared/useProducts";

const ProductsPage = () => {
  const navigate = useNavigate();
  const { totalQuantity } = useCartQuantities();
  const {
    productsData,
    showLoadMoreCTA,
    noProductsFound,
    currentPageValue,
    fetchProducts,
    handleFilterChange,
    price,
    currentCategoryString,
  } = useProducts();

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

  return (
    <>
      <HeaderComponent currentComponent={"Home"} cartCount={totalQuantity} />
      <h1 className="text-2xl font-bold mb-6 mt-4">E-Commerce Shop App</h1>
      <div className="flex justify-between">
        <div className="mr-6">
          <MultiFilterComponent applyFilters={handleFilterChange} />
        </div>

        <div className="flex flex-col items-center h-[80vh] overflow-y-auto">
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
              {productsData?.map((product) => {
                const { id } = product;
                return (
                  <div className="product-card" key={id} data-id={id}>
                    <ProductItem key={id} product={product} data-id={id} />
                  </div>
                );
              })}
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
