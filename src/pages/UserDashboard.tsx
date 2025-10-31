import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

const UserDashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    
    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .single();
    
    if (profileData) setProfile(profileData);

    // Fetch orders
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    
    if (ordersData) setOrders(ordersData);
    
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    toast.success(language === 'en' ? 'Logged out successfully' : 'सफलतापूर्वक लग आउट भयो');
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'processing':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <h1 className="text-4xl font-bold mb-8">
          {language === 'en' ? 'My Dashboard' : 'मेरो ड्यासबोर्ड'}
        </h1>

        <div className="grid gap-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Profile Information' : 'प्रोफाइल जानकारी'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">{language === 'en' ? 'Name' : 'नाम'}</p>
                <p className="font-medium">{profile?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{language === 'en' ? 'Email' : 'इमेल'}</p>
                <p className="font-medium">{profile?.email || user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{language === 'en' ? 'Phone' : 'फोन'}</p>
                <p className="font-medium">{profile?.phone || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Order History' : 'अर्डर इतिहास'}</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {language === 'en' ? 'No orders yet' : 'अहिलेसम्म कुनै अर्डर छैन'}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'en' ? 'Order ID' : 'अर्डर आईडी'}</TableHead>
                      <TableHead>{language === 'en' ? 'Date' : 'मिति'}</TableHead>
                      <TableHead>{language === 'en' ? 'Total' : 'जम्मा'}</TableHead>
                      <TableHead>{language === 'en' ? 'Status' : 'स्थिति'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          {order.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>NPR {order.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.order_status)}>
                            {order.order_status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Logout Button */}
          <div className="flex justify-center pt-4">
            <Button 
              variant="destructive" 
              size="lg"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-5 w-5" />
              {language === 'en' ? 'Logout' : 'लग आउट'}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
