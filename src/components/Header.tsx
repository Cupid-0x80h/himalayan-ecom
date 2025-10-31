import { ShoppingCart, Search, User, Menu, Globe, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <a href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              NepalEcom
            </span>
          </a>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchPlaceholder')}
              className="pl-9 pr-4"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleLanguage}
            title={language === 'ne' ? 'Switch to English' : 'नेपालीमा बदल्नुहोस्'}
          >
            <Globe className="h-5 w-5" />
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}>
                  {isAdmin ? (language === 'en' ? 'Admin Dashboard' : 'एडमिन ड्यासबोर्ड') : (language === 'en' ? 'My Dashboard' : 'मेरो ड्यासबोर्ड')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/auth')}
            >
              <User className="h-5 w-5" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground flex items-center justify-center">
                {cartCount > 3 ? '3+' : cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Categories Navigation */}
      <nav className="hidden md:block border-t border-border">
        <div className="container px-4">
          <ul className="flex items-center gap-6 py-3 text-sm">
            <li>
              <button 
                onClick={() => navigate('/products')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {language === 'en' ? 'All Products' : 'सबै उत्पादनहरू'}
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/about')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {language === 'en' ? 'About' : 'हाम्रो बारेमा'}
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/contact')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {language === 'en' ? 'Contact' : 'सम्पर्क'}
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};
