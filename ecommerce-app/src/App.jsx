import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductsPage from './EcommerceComponent/index';
import MyCart from './EcommerceComponent/MyCart';
import ProductDetailsPage from './EcommerceComponent/ProductDetailsPage';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import Checkout from './EcommerceComponent/CheckoutComponent';
import Orders from './EcommerceComponent/orders';

function App() {
  return (
    <Provider store={store}>
    <Router>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/productDetails" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<MyCart />} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/orders" element={<Orders/>} />
        </Routes>
      </div>
    </Router>
    </Provider>
  );
}

export default App;
