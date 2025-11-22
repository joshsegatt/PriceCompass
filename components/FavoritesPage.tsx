
import React, { useState, useEffect } from 'react';
import { Product, ToggleCompareFn } from '../types';
import { dataService } from '../services/dataService';
import ProductCard from './ProductCard';
import EmailQuoteModal from './EmailQuoteModal';

interface FavoritesPageProps {
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  comparisonList: Product[];
  toggleCompare: ToggleCompareFn;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ favorites, toggleFavorite, comparisonList, toggleCompare }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [quoteModalProduct, setQuoteModalProduct] = useState<Product | null>(null);

  useEffect(() => {
    // In a real app, this might be a single API call.
    // Here, we combine all mock data.
    setAllProducts(dataService.getAllProducts());
  }, [favorites]); // Re-fetch if favorites change to see price fluctuations

  const favoritedProducts = allProducts.filter(product => favorites.includes(product.id));

  const handleOpenQuoteModal = (product: Product) => {
    setQuoteModalProduct(product);
  };

  const handleCloseQuoteModal = () => {
    setQuoteModalProduct(null);
  };
  
  const isCompareFull = comparisonList.length >= 3;

  return (
    <>
      <section className="hero-cinematic w-full relative min-h-screen">
        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-20">
          <div className="text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tighter [text-shadow:0_2px_10px_rgba(0,0,0,0.3)]">Your Favorites</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300 [text-shadow:0_1px_8px_rgba(0,0,0,0.3)]">
              Here are the plans you've saved. Easily compare and manage your top choices.
            </p>
          </div>

          <div className="mt-16 min-h-[320px]">
            {favoritedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {favoritedProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEmailQuote={handleOpenQuoteModal}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                    isInCompareList={comparisonList.some(p => p.id === product.id)}
                    onToggleCompare={toggleCompare}
                    isCompareFull={isCompareFull}
                    className="animate-card-slide-in"
                    style={{ animationDelay: `${index * 60}ms` }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-8 bg-slate-800/50 backdrop-blur-lg border border-white/20 rounded-2xl shadow-soft">
                <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <h2 className="font-display text-2xl font-bold text-white">No Favorites Yet</h2>
                <p className="mt-2 text-slate-300 max-w-md mx-auto">Click the heart icon on any product to save it here for later.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <EmailQuoteModal product={quoteModalProduct} onClose={handleCloseQuoteModal} />
    </>
  );
};

export default FavoritesPage;
