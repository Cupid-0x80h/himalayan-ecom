import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const Products = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from('products').select('*');
    
    if (category) {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single();
      
      if (categoryData) {
        query = query.eq('category_id', categoryData.id);
      }
    }
    
    const { data, error } = await query;
    
    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          {category ? category.replace('-', ' ').toUpperCase() : language === 'en' ? 'All Products' : 'सबै उत्पादनहरू'}
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            {language === 'en' ? 'No products found' : 'कुनै उत्पादनहरू फेला परेन'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={language === 'en' ? product.title_en : product.title_ne}
                price={product.price}
                comparePrice={product.compare_price}
                image={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'}
                rating={4.5}
                reviews={0}
                inStock={product.stock > 0}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Products;
