import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/Home';
import ProductsPage from './pages/Products';
import ProductDetailPage from './pages/ProductDetail';
import CartPage from './pages/Cart';
import CheckoutPage from './pages/Checkout';
import SendEmailPage from './pages/SendEmail';
import NotFoundPage from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CartProvider>
        <SearchProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/"           element={<HomePage />} />
                <Route path="/products"   element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart"       element={<CartPage />} />
                <Route path="/checkout"   element={<CheckoutPage />} />
                <Route path="/send-email" element={<SendEmailPage />} />
                <Route path="*"           element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </SearchProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
