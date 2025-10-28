import { MouseTrailCanvas } from "@/components/MouseTrailCanvas";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Truck, CreditCard, Headphones } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  // Sample featured products
  const featuredProducts = [
    {
      id: "1",
      title: "नेपाली हस्तनिर्मित ऊनी स्कार्फ",
      price: 1200,
      comparePrice: 1500,
      image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500&h=500&fit=crop",
      rating: 4.5,
      reviews: 28,
      inStock: true,
    },
    {
      id: "2",
      title: "सोलार पावर बैंक 10,000mAh",
      price: 2500,
      comparePrice: 3200,
      image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop",
      rating: 4.8,
      reviews: 45,
      inStock: true,
    },
    {
      id: "3",
      title: "स्टेनलेस स्टील वाटर बोतल",
      price: 850,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
      rating: 4.3,
      reviews: 19,
      inStock: true,
    },
    {
      id: "4",
      title: "ब्लुटुथ वायरलेस हेडफोन",
      price: 3200,
      comparePrice: 4500,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      rating: 4.7,
      reviews: 67,
      inStock: true,
    },
    {
      id: "5",
      title: "योग म्याट प्रिमियम गुणस्तर",
      price: 1800,
      image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop",
      rating: 4.6,
      reviews: 34,
      inStock: true,
    },
    {
      id: "6",
      title: "किचन नाइफ सेट (५ पिस)",
      price: 2200,
      comparePrice: 2800,
      image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&h=500&fit=crop",
      rating: 4.4,
      reviews: 23,
      inStock: false,
    },
  ];

  const categoryData = [
    { icon: "📱", count: 250 },
    { icon: "👕", count: 180 },
    { icon: "🏠", count: 320 },
    { icon: "⚽", count: 95 },
    { icon: "📚", count: 150 },
    { icon: "💄", count: 200 },
  ];
  
  const categories = t('categories').map((name: string, index: number) => ({
    name,
    icon: categoryData[index]?.icon || "📦",
    count: categoryData[index]?.count || 0,
  }));

  return (
    <div className="relative min-h-screen">
      <MouseTrailCanvas />
      <Header />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="container px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
              <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
                {t('heroBadge')}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                {t('heroTitle')}
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t('heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2 text-base">
                  {t('shopNow')}
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-base">
                  {t('viewDeals')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 bg-card border-y border-border">
          <div className="container px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t('freeDelivery')}</h3>
                  <p className="text-xs text-muted-foreground">{t('freeDeliveryDesc')}</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t('securePayment')}</h3>
                  <p className="text-xs text-muted-foreground">{t('securePaymentDesc')}</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t('easyPayment')}</h3>
                  <p className="text-xs text-muted-foreground">{t('easyPaymentDesc')}</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Headphones className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t('support247')}</h3>
                  <p className="text-xs text-muted-foreground">{t('support247Desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16">
          <div className="container px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-2">{t('categoriesTitle')}</h2>
              <p className="text-muted-foreground">{t('categoriesSubtitle')}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className="group p-6 rounded-xl border border-border bg-card hover:bg-primary/5 hover:border-primary transition-all duration-300"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count} {t('products')}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-2">{t('featuredProducts')}</h2>
                <p className="text-muted-foreground">{t('featuredProductsDesc')}</p>
              </div>
              <Button variant="outline" className="hidden md:flex gap-2">
                {t('viewAll')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="animate-scale-in">
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
            <div className="text-center mt-8 md:hidden">
              <Button variant="outline" className="gap-2">
                {t('viewAll')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-10" />
          <div className="container px-4 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('getSpecialOffers')}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t('newsletterDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button className="whitespace-nowrap">{t('subscribe')}</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
