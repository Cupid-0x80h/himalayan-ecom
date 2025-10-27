import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  quantity: number;
  products: {
    id: string;
    title_en: string;
    title_ne: string;
    price: number;
    images: any;
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

    if (data) setCartItems(data as any);
    setLoading(false);
  };

  const updateQuantity = async (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const { error } = await supabase
      .from('cart')
      .update({ quantity: newQuantity })
      .eq('id', cartId);

    if (!error) {
      fetchCart();
    }
  };

  const removeItem = async (cartId: string) => {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', cartId);

    if (!error) {
      toast.success('Item removed from cart');
      fetchCart();
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 100;
  const total = subtotal + shipping;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <h1 className="text-4xl font-bold mb-8">{t('cart.title')}</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">{t('cart.empty')}</p>
            <Button onClick={() => navigate('/')}>{t('cart.continueShopping')}</Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const title = language === 'en' ? item.products.title_en : item.products.title_ne;
                return (
                  <div key={item.id} className="bg-card p-4 rounded-lg flex gap-4">
                    <img
                      src={item.products.images[0] || '/placeholder.svg'}
                      alt={title}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{title}</h3>
                      <p className="text-lg font-bold">NPR {item.products.price.toLocaleString()}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="px-4">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.products.stock}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <p className="font-bold">
                        NPR {(item.products.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-card p-6 rounded-lg h-fit">
              <h2 className="text-2xl font-semibold mb-4">{t('checkout.orderSummary')}</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal')}</span>
                  <span>NPR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart.shipping')}</span>
                  <span>NPR {shipping.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold">
                    <span>{t('cart.grandTotal')}</span>
                    <span>NPR {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <Button
                className="w-full mt-6"
                size="lg"
                onClick={() => navigate('/checkout')}
              >
                {t('cart.checkout')}
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
