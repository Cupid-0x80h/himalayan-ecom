import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  quantity: number;
  products: {
    id: string;
    title_en: string;
    title_ne: string;
    price: number;
  };
}

const Checkout = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('esewa');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('cart')
      .select('*, products(*)')
      .eq('user_id', user.id);

    if (data) setCartItems(data);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 100;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    const orderItems = cartItems.map(item => ({
      product_id: item.products.id,
      title: language === 'en' ? item.products.title_en : item.products.title_ne,
      price: item.products.price,
      quantity: item.quantity,
    }));

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id,
        items: orderItems,
        subtotal,
        shipping,
        total,
        payment_method: paymentMethod,
        payment_status: 'pending',
        order_status: 'pending',
        shipping_address: { name, address, city, phone },
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to place order');
      setLoading(false);
      return;
    }

    await supabase
      .from('cart')
      .delete()
      .eq('user_id', user?.id);

    toast.success('Order placed successfully!');
    navigate('/');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <h1 className="text-4xl font-bold mb-8">{t('checkout.title')}</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">{t('checkout.shipping')}</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t('checkout.name')}</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">{t('checkout.address')}</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">{t('checkout.city')}</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t('checkout.phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">{t('checkout.payment')}</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="esewa" id="esewa" />
                    <Label htmlFor="esewa">{t('checkout.esewa')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="khalti" id="khalti" />
                    <Label htmlFor="khalti">{t('checkout.khalti')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="imepay" id="imepay" />
                    <Label htmlFor="imepay">{t('checkout.imepay')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank">{t('checkout.bank')}</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg h-fit">
              <h2 className="text-2xl font-semibold mb-4">{t('checkout.orderSummary')}</h2>
              <div className="space-y-2 mb-4">
                {cartItems.map((item) => {
                  const title = language === 'en' ? item.products.title_en : item.products.title_ne;
                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{title} × {item.quantity}</span>
                      <span>NPR {(item.products.price * item.quantity).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2 border-t pt-2">
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
                type="submit"
                className="w-full mt-6"
                size="lg"
                disabled={loading || cartItems.length === 0}
              >
                {loading ? 'Processing...' : t('checkout.placeOrder')}
              </Button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
