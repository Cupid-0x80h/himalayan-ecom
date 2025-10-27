import { ShoppingCart, Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Header = () => {
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
              placeholder="उत्पादनहरू खोज्नुहोस्..."
              className="pl-9 pr-4"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground flex items-center justify-center">
              0
            </span>
          </Button>
        </div>
      </div>

      {/* Categories Navigation */}
      <nav className="hidden md:block border-t border-border">
        <div className="container px-4">
          <ul className="flex items-center gap-6 py-3 text-sm">
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                इलेक्ट्रोनिक्स
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                लुगा र फेसन
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                घर र भान्सा
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                खेलकुद
              </a>
            </li>
            <li>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                किताब र स्टेशनरी
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};
