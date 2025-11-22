
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Category, Product, ToggleCompareFn } from '../types';
import { dataService } from '../services/dataService';
import ProductCard from './ProductCard';
import EmailQuoteModal from './EmailQuoteModal';

interface CataloguePageProps {
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  comparisonList: Product[];
  toggleCompare: ToggleCompareFn;
}

const CataloguePage: React.FC<CataloguePageProps> = ({ favorites, toggleFavorite, comparisonList, toggleCompare }) => {
  const [activeCategory, setActiveCategory] = useState<Category>(Category.Broadband);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quoteModalProduct, setQuoteModalProduct] = useState<Product | null>(null);
  
  const tabsRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    setLoading(true);
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setProducts(dataService.getProductsByCategory(activeCategory));
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  useLayoutEffect(() => {
    if (tabsRef.current && !loading) {
      const activeTab = tabsRef.current.querySelector<HTMLButtonElement>(`[data-category="${activeCategory}"]`);
      if (activeTab) {
        setIndicatorStyle({
          left: activeTab.offsetLeft,
          width: activeTab.offsetWidth,
          opacity: 1,
        });
      }
    }
  }, [activeCategory, loading]);
  
  const categories = Object.values(Category).filter(c => c !== Category.Other);

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
              <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tighter [text-shadow:0_2px_10px_rgba(0,0,0,0.3)]">Find Your Perfect Plan</h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300 [text-shadow:0_1px_8px_rgba(0,0,0,0.3)]">Select a category to start comparing top UK providers.</p>
          </div>

          {/* New Minimalist Category Tabs with Sliding Indicator */}
          <div className="mt-12 flex justify-center">
            <div ref={tabsRef} className="relative flex items-center gap-4 sm:gap-8">
              <div 
                className="absolute h-10 bg-white/10 backdrop-blur-sm rounded-full z-0"
                style={{
                  ...indicatorStyle,
                  transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                }}
              />
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    data-category={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative z-10 px-5 py-2 text-sm font-semibold rounded-full transition-colors duration-300
                      ${isActive ? 'text-white' : 'text-slate-300 hover:text-white'}`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid */}
          <div className="mt-16 min-h-[320px]">
            {!loading ? (
              <div
                key={activeCategory} // Key change ensures children re-mount and animations re-run
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {products.map((product, index) => (
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
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        </div>
      </section>
      <EmailQuoteModal product={quoteModalProduct} onClose={handleCloseQuoteModal} />
    </>
  );
};

export default CataloguePage;
