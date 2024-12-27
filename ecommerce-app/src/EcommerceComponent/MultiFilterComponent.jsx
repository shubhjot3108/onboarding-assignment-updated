import { getProductCategories } from "../services/getAllProductCategories";
import { useEffect, useState } from "react";
import { initialFilters } from "./constants";
import { useSelector } from "react-redux";

const MultiFilterComponent = (props) => {
  const { applyFilters } = props;
  const [filters, setFilters] = useState(initialFilters);
  const [priceError, setPriceError] = useState("");
  const [enableApplyCTA, setEnableApplyCTA] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    Categories: [],
    "Customer Rating": [],
    price: { minPrice: null, maxPrice: null },
  });
  const filtersRedux = useSelector((state) => state.filters.selectedFilters);
  const fetchCategories = async () => {
    try {
      const response = await getProductCategories();
      if (!!response?.length) {
        const transformedData = response.map((item) => ({
          id: item,
          label: item,
        }));

        setFilters((prevFilters) => {
          return prevFilters.map((filter) => {
            if (filter.Categories) {
              return {
                ...filter,
                Categories: transformedData,
              };
            }
            return filter;
          });
        });
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handlePriceChange = (type, value) => {
    setEnableApplyCTA(true);
    setSelectedFilters((prevSelectedFilters) => ({
      ...prevSelectedFilters,
      price: {
        minPrice: type === "min" ? value : prevSelectedFilters?.price.minPrice,
        maxPrice: type === "max" ? value : prevSelectedFilters?.price.maxPrice,
      },
    }));
  };

  const ApplyAndValidate = () => {
    setEnableApplyCTA(false);
    setPriceError(
      Number(selectedFilters?.price.minPrice) >
        Number(selectedFilters?.price.maxPrice)
        ? "Minimum price should be less than maximum price."
        : ""
    );
    Number(selectedFilters?.price.minPrice) <=
    Number(selectedFilters?.price.maxPrice)
      ? applyFilters(selectedFilters)
      : null;
  };

  const handleFilterChange = (filterGroup, value, isChecked) => {
    setEnableApplyCTA(true);
    setSelectedFilters((prevSelectedFilters) => {
      const updatedGroup = isChecked
        ? [...prevSelectedFilters[filterGroup], value]
        : prevSelectedFilters[filterGroup].filter((item) => item !== value);
      return { ...prevSelectedFilters, [filterGroup]: updatedGroup };
    });
  };

  const handleClearFilters = () => {
    setEnableApplyCTA(true);
    setSelectedFilters({
      Categories: [],
      "Customer Rating": [],
      price: { minPrice: "", maxPrice: "" },
    });
  };
  
  useEffect(() => {
    fetchCategories();
    if (
      filtersRedux.Categories.length > 0 ||
      filtersRedux.price.minPrice ||
      filtersRedux.price.maxPrice
    ) {
      setSelectedFilters(filtersRedux);
    }
  }, []);

  return (
    <div className="w-64 flex flex-col justify-center">
      <div className="flex justify-between">
        <span className="text-[1.2rem] font-bold">Filters</span>
        <span
          className="text-blue-300 text-[1rem] font-normal pt-[0.2rem] cursor-pointer"
          onClick={handleClearFilters}
        >
          Clear Filters
        </span>
      </div>
      <div className="bg-gray-100 p-4">
        {filters.map((filterGroup, index) => {
          const [filterTitle, filterOptions] = Object.entries(filterGroup)[0];

          return (
            <div key={index} className="mb-6">
              <h2 className="font-bold text-lg mb-2">{filterTitle}</h2>
              <div className="flex flex-col max-h-[15rem] overflow-y-auto">
                {filterOptions.map((option) => (
                  <div key={option.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={option.id}
                      checked={selectedFilters[filterTitle]?.includes(
                        option.id
                      )}
                      className="mr-2"
                      onChange={(e) =>
                        handleFilterChange(
                          filterTitle,
                          option.id,
                          e.target.checked
                        )
                      }
                    />
                    <label htmlFor={option.id} className="text-gray-700">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div className="mb-6">
          <h2 className="font-bold text-lg mb-2">Price Range</h2>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={selectedFilters?.price.minPrice}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            <input
              type="number"
              placeholder="Max"
              value={selectedFilters?.price.maxPrice}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          {priceError && (
            <p className="text-red-500 text-sm mt-1">{priceError}</p>
          )}
        </div>
      </div>
      <button
        className={`w-[80%] p-2 rounded-md mx-auto mt-[0.2rem] ${
          enableApplyCTA
            ? "bg-blue-500 text-white"
            : "bg-gray-400 text-gray-700 cursor-not-allowed"
        }`}
        onClick={enableApplyCTA ? ApplyAndValidate : null}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default MultiFilterComponent;