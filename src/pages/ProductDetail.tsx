import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

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
}

interface Rating {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
}

const ProductDetail = () => {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (data) {
      setProduct(data);
      fetchRatings(data.id);
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

    if (data) setRatings(data as any);
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/auth');
      return;
    }

    const { error } = await supabase
      .from('cart')
      .upsert({
        user_id: user.id,
        product_id: product?.id,
        quantity: 1,
      }, { onConflict: 'user_id,product_id' });

    if (error) {
      toast.error('Failed to add to cart');
    } else {
      toast.success('Added to cart!');
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please login to submit a review');
      navigate('/auth');
      return;
    }

    const { error } = await supabase
      .from('ratings')
      .insert({
        user_id: user.id,
        product_id: product?.id,
        rating: userRating,
        comment: userComment,
      });

    if (error) {
      toast.error('Failed to submit review');
    } else {
      toast.success('Review submitted!');
      setUserComment('');
      setUserRating(5);
      if (product) fetchRatings(product.id);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  const title = language === 'en' ? product.title_en : product.title_ne;
  const description = language === 'en' ? product.description_en : product.description_ne;
  const discount = product.compare_price ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : 0;
  const avgRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1) : '0';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={product.images[0] || '/placeholder.svg'}
              alt={title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold">{title}</h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-semibold">{avgRating}</span>
                <span className="ml-2 text-muted-foreground">({ratings.length} {t('product.reviews')})</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">NPR {product.price.toLocaleString()}</span>
              {product.compare_price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    NPR {product.compare_price.toLocaleString()}
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                    {discount}% {t('product.discount')}
                  </span>
                </>
              )}
            </div>

            <div>
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? t('product.inStock') : t('product.outOfStock')}
              </span>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {t('product.addToCart')}
            </Button>

            <div>
              <h2 className="text-2xl font-semibold mb-4">{t('product.description')}</h2>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">{t('product.ratings')}</h2>
          
          {user && (
            <div className="bg-card p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-4">{t('product.writeReview')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">{t('product.yourRating')}</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= userRating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block mb-2">{t('product.yourReview')}</label>
                  <Textarea
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button onClick={handleSubmitReview}>{t('product.submit')}</Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {ratings.map((rating) => (
              <div key={rating.id} className="bg-card p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {new Date(rating.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p>{rating.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
