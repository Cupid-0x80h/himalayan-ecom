import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const Admin = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    title_en: '',
    title_ne: '',
    description_en: '',
    description_ne: '',
    price: '',
    compare_price: '',
    stock: '',
    category_id: '',
    slug: '',
    sku: '',
    images: ''
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
      toast.error('Access denied');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchOrders();
      fetchCategories();
    }
  }, [isAdmin]);

  // Real-time subscription for orders
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('admin-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name_en', { ascending: true });
    if (data) setCategories(data);
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, categories(name_en)')
      .order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const fetchOrders = async () => {
    console.log('Fetching orders as admin...');
    
    const { data, error } = await supabase
      .from('orders')
      .select('*, profiles(name)')
      .order('created_at', { ascending: false });
    
    console.log('Orders fetch result:', { data, error, count: data?.length });
    
    if (error) {
      console.error('Error fetching orders:', error);
    }
    
    if (data) setOrders(data);
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (!error) {
      toast.success('Product deleted');
      fetchProducts();
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ order_status: status })
      .eq('id', orderId);

    if (!error) {
      toast.success('Order status updated');
      fetchOrders();
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('products')
      .insert({
        title_en: newProduct.title_en,
        title_ne: newProduct.title_ne,
        description_en: newProduct.description_en,
        description_ne: newProduct.description_ne,
        price: parseFloat(newProduct.price),
        compare_price: newProduct.compare_price ? parseFloat(newProduct.compare_price) : null,
        stock: parseInt(newProduct.stock),
        category_id: newProduct.category_id,
        slug: newProduct.slug,
        sku: newProduct.sku,
        images: newProduct.images ? [newProduct.images] : []
      });

    if (!error) {
      toast.success('Product added successfully');
      setShowAddForm(false);
      setNewProduct({
        title_en: '',
        title_ne: '',
        description_en: '',
        description_ne: '',
        price: '',
        compare_price: '',
        stock: '',
        category_id: '',
        slug: '',
        sku: '',
        images: ''
      });
      fetchProducts();
    } else {
      toast.error('Failed to add product');
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const { error } = await supabase
      .from('products')
      .update({
        title_en: newProduct.title_en,
        title_ne: newProduct.title_ne,
        description_en: newProduct.description_en,
        description_ne: newProduct.description_ne,
        price: parseFloat(newProduct.price),
        compare_price: newProduct.compare_price ? parseFloat(newProduct.compare_price) : null,
        stock: parseInt(newProduct.stock),
        category_id: newProduct.category_id,
        slug: newProduct.slug,
        sku: newProduct.sku,
        images: newProduct.images ? [newProduct.images] : []
      })
      .eq('id', editingProduct.id);

    if (!error) {
      toast.success('Product updated successfully');
      setEditingProduct(null);
      setNewProduct({
        title_en: '',
        title_ne: '',
        description_en: '',
        description_ne: '',
        price: '',
        compare_price: '',
        stock: '',
        category_id: '',
        slug: '',
        sku: '',
        images: ''
      });
      fetchProducts();
    } else {
      toast.error('Failed to update product');
    }
  };

  const startEditProduct = (product: any) => {
    setEditingProduct(product);
    setNewProduct({
      title_en: product.title_en,
      title_ne: product.title_ne,
      description_en: product.description_en || '',
      description_ne: product.description_ne || '',
      price: product.price.toString(),
      compare_price: product.compare_price?.toString() || '',
      stock: product.stock.toString(),
      category_id: product.category_id,
      slug: product.slug,
      sku: product.sku || '',
      images: product.images?.[0] || ''
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setNewProduct({
      title_en: '',
      title_ne: '',
      description_en: '',
      description_ne: '',
      price: '',
      compare_price: '',
      stock: '',
      category_id: '',
      slug: '',
      sku: '',
      images: ''
    });
  };

  const handleLogout = async () => {
    await signOut();
    toast.success(language === 'en' ? 'Logged out successfully' : 'सफलतापूर्वक लग आउट भयो');
    navigate('/');
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <h1 className="text-4xl font-bold mb-8">{t('admin.dashboard')}</h1>

        <Tabs defaultValue="products" className="w-full">
          <TabsList>
            <TabsTrigger value="products">{t('admin.products')}</TabsTrigger>
            <TabsTrigger value="orders">{t('admin.orders')}</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <div className="mb-4 flex gap-2">
              <Button onClick={() => {
                setShowAddForm(!showAddForm);
                if (editingProduct) cancelEdit();
              }}>
                <Plus className="w-4 h-4 mr-2" />
                {showAddForm ? 'Cancel' : 'Add New Product'}
              </Button>
              {editingProduct && (
                <Button variant="outline" onClick={cancelEdit}>
                  Cancel Edit
                </Button>
              )}
            </div>

            {editingProduct && (
              <form onSubmit={handleEditProduct} className="mb-6 p-6 border rounded-lg space-y-4">
                <h3 className="text-xl font-semibold mb-4">Edit Product</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Title (English)"
                    value={newProduct.title_en}
                    onChange={(e) => setNewProduct({...newProduct, title_en: e.target.value})}
                    required
                  />
                  <Input
                    placeholder="Title (Nepali)"
                    value={newProduct.title_ne}
                    onChange={(e) => setNewProduct({...newProduct, title_ne: e.target.value})}
                    required
                  />
                  <Textarea
                    placeholder="Description (English)"
                    value={newProduct.description_en}
                    onChange={(e) => setNewProduct({...newProduct, description_en: e.target.value})}
                    required
                  />
                  <Textarea
                    placeholder="Description (Nepali)"
                    value={newProduct.description_ne}
                    onChange={(e) => setNewProduct({...newProduct, description_ne: e.target.value})}
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Compare Price (optional)"
                    value={newProduct.compare_price}
                    onChange={(e) => setNewProduct({...newProduct, compare_price: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="Stock"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    required
                  />
                  <Select
                    value={newProduct.category_id}
                    onValueChange={(value) => setNewProduct({...newProduct, category_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Slug (e.g., product-name)"
                    value={newProduct.slug}
                    onChange={(e) => setNewProduct({...newProduct, slug: e.target.value})}
                    required
                  />
                  <Input
                    placeholder="SKU"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    required
                  />
                  <Input
                    placeholder="Image URL"
                    value={newProduct.images}
                    onChange={(e) => setNewProduct({...newProduct, images: e.target.value})}
                    className="col-span-2"
                  />
                </div>
                
                <Button type="submit">Update Product</Button>
              </form>
            )}

            {showAddForm && (
              <form onSubmit={handleAddProduct} className="mb-6 p-6 border rounded-lg space-y-4">
                <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Title (English)"
                    value={newProduct.title_en}
                    onChange={(e) => setNewProduct({...newProduct, title_en: e.target.value})}
                    required
                  />
                  <Input
                    placeholder="Title (Nepali)"
                    value={newProduct.title_ne}
                    onChange={(e) => setNewProduct({...newProduct, title_ne: e.target.value})}
                    required
                  />
                  <Textarea
                    placeholder="Description (English)"
                    value={newProduct.description_en}
                    onChange={(e) => setNewProduct({...newProduct, description_en: e.target.value})}
                    required
                  />
                  <Textarea
                    placeholder="Description (Nepali)"
                    value={newProduct.description_ne}
                    onChange={(e) => setNewProduct({...newProduct, description_ne: e.target.value})}
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Compare Price (optional)"
                    value={newProduct.compare_price}
                    onChange={(e) => setNewProduct({...newProduct, compare_price: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="Stock"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    required
                  />
                  <Select
                    value={newProduct.category_id}
                    onValueChange={(value) => setNewProduct({...newProduct, category_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Slug (e.g., product-name)"
                    value={newProduct.slug}
                    onChange={(e) => setNewProduct({...newProduct, slug: e.target.value})}
                    required
                  />
                  <Input
                    placeholder="SKU"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    required
                  />
                  <Input
                    placeholder="Image URL"
                    value={newProduct.images}
                    onChange={(e) => setNewProduct({...newProduct, images: e.target.value})}
                    className="col-span-2"
                  />
                </div>
                
                <Button type="submit">Add Product</Button>
              </form>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.title')}</TableHead>
                  <TableHead>{t('admin.price')}</TableHead>
                  <TableHead>{t('admin.stock')}</TableHead>
                  <TableHead>{t('admin.category')}</TableHead>
                  <TableHead>{t('admin.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.title_en}</TableCell>
                    <TableCell>NPR {product.price.toLocaleString()}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.categories?.name_en}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => startEditProduct(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                    <TableCell>{order.profiles?.name}</TableCell>
                    <TableCell>NPR {order.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <select
                        value={order.order_status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="bg-background border rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>

        {/* Logout Button */}
        <div className="flex justify-center pt-8 mt-8 border-t">
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
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
