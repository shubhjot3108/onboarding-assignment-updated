import { getProductCategories } from "../getAllProductCategories";

global.fetch = jest.fn();

describe("getProductCategories", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and returns product categories successfully", async () => {
    const mockCategories = ["electronics", "clothing", "home appliances"];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockCategories),
    });

    const categories = await getProductCategories();

    expect(fetch).toHaveBeenCalledWith(
      "https://fake-ecommerce-app-api.onrender.com/products/categories"
    );
    expect(categories).toEqual(mockCategories);
  });

  it("throws an error when the fetch operation fails", async () => {
    const mockError = new Error("Fetch failed");
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    fetch.mockRejectedValueOnce(mockError);
    await expect(getProductCategories()).rejects.toThrow(mockError);
    expect(consoleSpy).toHaveBeenCalledWith(
        "There was a problem with the fetch operation:",
        mockError
      );
  });
});
