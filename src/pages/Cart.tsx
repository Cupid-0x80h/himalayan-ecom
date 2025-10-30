import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  products: {
    id: string;
    title_en: string;
    title_ne: string;
    price: number;
    images: string[];
    stock: number;
  };
}

const Cart = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('cart')
      .select('*, products(*)')
      .eq('user_id', user.id);

    if (!error && data) {
      setCartItems(data as CartItem[]);
    }
    setLoading(false);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const { error } = await supabase
      .from('cart')
      .update({ quantity: newQuantity })
      .eq('id', itemId);

    if (!error) {
      fetchCart();
      toast.success(language === 'en' ? 'Cart updated' : 'कार्ट अपडेट गरियो');
    }
  };

  const removeItem = async (itemId: string) => {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', itemId);

    if (!error) {
      fetchCart();
      toast.success(language === 'en' ? 'Item removed' : 'वस्तु हटाइयो');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 100 : 0;
  const total = subtotal + shipping;

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-8">
          {language === 'en' ? 'Shopping Cart' : 'किनमेल कार्ट'}
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground mb-6">
              {language === 'en' ? 'Your cart is empty' : 'तपाईंको कार्ट खाली छ'}
            </p>
            <Button onClick={() => navigate('/products')}>
              {language === 'en' ? 'Continue Shopping' : 'किनमेल जारी राख्नुहोस्'}
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                  <img
                    src={item.products.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                    alt={language === 'en' ? item.products.title_en : item.products.title_ne}
                    className="w-24 h-24 object-cover rounded"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">
                      {language === 'en' ? item.products.title_en : item.products.title_ne}
                    </h3>
                    <p className="text-lg font-bold text-primary mb-2">
                      {language === 'en' ? 'NPR' : 'रू'} {item.products.price.toLocaleString()}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.products.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold">
                      {language === 'en' ? 'NPR' : 'रू'} {(item.products.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">
                  {language === 'en' ? 'Order Summary' : 'अर्डर सारांश'}
                </h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>{language === 'en' ? 'Subtotal' : 'उप-कुल'}:</span>
                    <span>{language === 'en' ? 'NPR' : 'रू'} {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'en' ? 'Shipping' : 'ढुवानी'}:</span>
                    <span>{language === 'en' ? 'NPR' : 'रू'} {shipping.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>{language === 'en' ? 'Total' : 'जम्मा'}:</span>
                      <span>{language === 'en' ? 'NPR' : 'रू'} {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full" onClick={() => navigate('/checkout')}>
                  {language === 'en' ? 'Proceed to Checkout' : 'चेकआउटमा जानुहोस्'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
