import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Star, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { ProductCard } from '@/components/ProductCard';

interface Product {
  id: string;
  title_en: string;
  title_ne: string;
  description_en: string;
  description_ne: string;
  price: number;
  compare_price: number;
  stock: number;
  images: any;
  category_id: string;
}

interface Rating {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  profiles: {
    name: string;
  } | null;
}

const ProductDetail = () => {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (!error && data) {
      setProduct(data);
      fetchRatings(data.id);
      fetchSuggestedProducts(data.category_id, data.id);
    }
    setLoading(false);
  };

  const fetchRatings = async (productId: string) => {
    const { data } = await supabase
      .from('ratings')
      .select('*')
      .eq('product_id', productId)
      .eq('moderation_status', 'visible')
      .order('created_at', { ascending: false });

    if (data) {
      const ratingsWithProfiles = await Promise.all(
        data.map(async (rating) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', rating.user_id)
            .maybeSingle();
          
          return {
            ...rating,
            profiles: profile || { name: 'Anonymous' }
          };
        })
      );
      setRatings(ratingsWithProfiles as Rating[]);
    }
  };

  const fetchSuggestedProducts = async (categoryId: string, currentProductId: string) => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .neq('id', currentProductId)
      .limit(4);

    if (data) setSuggestedProducts(data);
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/auth');
      toast.error(language === 'en' ? 'Please login to add items to cart' : 'कार्टमा वस्तुहरू थप्न कृपया लगइन गर्नुहोस्');
      return;
    }

    if (!product) return;

    const { data: existingItem } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .maybeSingle();

    if (existingItem) {
      const { error } = await supabase
        .from('cart')
        .update({ quantity: existingItem.quantity + 1 })
        .eq('id', existingItem.id);

      if (!error) {
        toast.success(language === 'en' ? 'Added to cart' : 'कार्टमा थपियो');
      }
    } else {
      const { error } = await supabase
        .from('cart')
        .insert({
          user_id: user.id,
          product_id: product.id,
          quantity: 1
        });

      if (!error) {
        toast.success(language === 'en' ? 'Added to cart' : 'कार्टमा थपियो');
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!product) return;

    const { error } = await supabase
      .from('ratings')
      .insert({
        user_id: user.id,
        product_id: product.id,
        rating: userRating,
        comment: userComment
      });

    if (!error) {
      toast.success(language === 'en' ? 'Review submitted' : 'समीक्षा पेश गरियो');
      setUserComment('');
      setUserRating(5);
      fetchRatings(product.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>{t('loading')}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>{language === 'en' ? 'Product not found' : 'उत्पादन फेला परेन'}</p>
        </main>
        <Footer />
      </div>
    );
  }

  const avgRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
              alt={language === 'en' ? product.title_en : product.title_ne}
              className="w-full rounded-lg"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">
              {language === 'en' ? product.title_en : product.title_ne}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(avgRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground">
                ({ratings.length} {language === 'en' ? 'reviews' : 'समीक्षाहरू'})
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-bold text-primary">
                {language === 'en' ? 'NPR' : 'रू'} {product.price.toLocaleString()}
              </span>
              {product.compare_price && (
                <span className="text-xl text-muted-foreground line-through">
                  {language === 'en' ? 'NPR' : 'रू'} {product.compare_price.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-muted-foreground mb-6">
              {language === 'en' ? product.description_en : product.description_ne}
            </p>

            <p className="mb-6">
              <span className="font-semibold">{language === 'en' ? 'Stock' : 'स्टक'}: </span>
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 
                  ? `${product.stock} ${language === 'en' ? 'available' : 'उपलब्ध'}` 
                  : language === 'en' ? 'Out of stock' : 'स्टकमा छैन'}
              </span>
            </p>

            <Button
              size="lg"
              className="w-full gap-2"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5" />
              {language === 'en' ? 'Add to Cart' : 'कार्टमा थप्नुहोस्'}
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {language === 'en' ? 'Customer Reviews' : 'ग्राहक समीक्षाहरू'}
          </h2>

          {user && (
            <div className="mb-6 p-4 border rounded-lg">
              <h3 className="font-semibold mb-3">
                {language === 'en' ? 'Write a Review' : 'समीक्षा लेख्नुहोस्'}
              </h3>
              
              <div className="flex gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer ${
                      star <= userRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    onClick={() => setUserRating(star)}
                  />
                ))}
              </div>

              <Textarea
                placeholder={language === 'en' ? 'Share your experience...' : 'आफ्नो अनुभव साझा गर्नुहोस्...'}
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                className="mb-3"
              />

              <Button onClick={handleSubmitReview}>
                {language === 'en' ? 'Submit Review' : 'समीक्षा पेश गर्नुहोस्'}
              </Button>
            </div>
          )}

          <div className="space-y-4">
            {ratings.map((rating) => (
              <div key={rating.id} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rating.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{rating.profiles?.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(rating.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground">{rating.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Products */}
        {suggestedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {language === 'en' ? 'You May Also Like' : 'तपाईंलाई पनि मनपर्न सक्छ'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  slug={p.slug}
                  title={language === 'en' ? p.title_en : p.title_ne}
                  price={p.price}
                  comparePrice={p.compare_price}
                  image={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                  rating={4.5}
                  reviews={0}
                  inStock={p.stock > 0}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
