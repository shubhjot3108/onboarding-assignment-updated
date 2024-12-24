import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './redux/store';
import { Provider } from 'react-redux';

const ProductsPage = lazy(() => import('./EcommerceComponent/index'));
const MyCart = lazy(() => import('./EcommerceComponent/MyCart'));
const ProductDetailsPage = lazy(() => import('./EcommerceComponent/ProductDetailsPage'));
const Checkout = lazy(() => import('./EcommerceComponent/CheckoutComponent'));
const Orders = lazy(() => import('./EcommerceComponent/orders'));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="container mx-auto p-4">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<ProductsPage />} />
              <Route path="/productDetails" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<MyCart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
