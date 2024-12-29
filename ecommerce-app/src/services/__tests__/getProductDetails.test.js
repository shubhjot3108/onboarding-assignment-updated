import { getProductDetails } from "../getProductDetails";

global.fetch = jest.fn();

describe("getProductDetails", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches product details successfully", async () => {
    const mockProduct = {
      id: 1,
      title: "Test Product",
      price: 100,
    };

    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockProduct),
    });

    const result = await getProductDetails({ productId: 1 });

    expect(fetch).toHaveBeenCalledWith(
      "https://fake-ecommerce-app-api.onrender.com/products/1"
    );
    expect(result).toEqual(mockProduct);
  });

  it("throws an error when fetch fails", async () => {
    const mockError = new Error("Fetch failed");
    fetch.mockRejectedValueOnce(mockError);

    await expect(getProductDetails({ productId: 1 })).rejects.toThrow("Fetch failed");

    expect(fetch).toHaveBeenCalledWith(
      "https://fake-ecommerce-app-api.onrender.com/products/1"
    );
  });

  it("logs an error message when fetch fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const mockError = new Error("Network error");
    fetch.mockRejectedValueOnce(mockError);

    await expect(getProductDetails({ productId: 1 })).rejects.toThrow("Network error");

    expect(consoleSpy).toHaveBeenCalledWith(
      "There was a problem with the fetch operation:",
      mockError
    );

    consoleSpy.mockRestore();
  });
});
