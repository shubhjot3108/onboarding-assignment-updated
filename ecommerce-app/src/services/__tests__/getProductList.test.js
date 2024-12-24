import { getProductList } from '../getProductList';
global.fetch = jest.fn();
describe('getProductList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should call the API with correct parameters and return data', async () => {
    const mockData = { products: [] }; // Sample mock data you expect from the API
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    const params = {
      page: 1,
      categoriesString: 'smartphones,laptops',
      minPrice: 100,
      maxPrice: 1500,
    };

    const result = await getProductList(params);

    expect(fetch).toHaveBeenCalledWith(
      'https://fake-ecommerce-app-api.onrender.com/products?limit=4&page=1&category=smartphones,laptops&minPrice=100&maxPrice=1500'
    );
    expect(result).toEqual(mockData);
  });

  it('should use default category, minPrice, and maxPrice when not provided', async () => {
    const mockData = { products: [] };
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    const params = { page: 1 };

    const result = await getProductList(params);

    expect(fetch).toHaveBeenCalledWith(
      'https://fake-ecommerce-app-api.onrender.com/products?limit=4&page=1&category=smartphones,laptops&minPrice=0&maxPrice=5000'
    );
    expect(result).toEqual(mockData);
  });

  it('should handle fetch errors correctly', async () => {
    const errorMessage = 'API Error';
    fetch.mockRejectedValueOnce(new Error(errorMessage));

    const params = { page: 1 };

    await expect(getProductList(params)).rejects.toThrow(errorMessage);
  });
});
