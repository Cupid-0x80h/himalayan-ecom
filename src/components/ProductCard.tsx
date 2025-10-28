import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  comparePrice?: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export const ProductCard = ({
  id,
  title,
  price,
  comparePrice,
  image,
  rating,
  reviews,
  inStock,
}: ProductCardProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const discount = comparePrice
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;
  
  const formatPrice = (price: number) => {
    return language === 'en' 
      ? `NPR ${price.toLocaleString('en-NP')}`
      : `रू ${price.toLocaleString('ne-NP')}`;
  };
  
  const discountText = language === 'en' ? 'OFF' : 'छुट';
  const outOfStockText = language === 'en' ? 'Out of Stock' : 'स्टकमा छैन';
  const addToCartText = language === 'en' ? 'Add to Cart' : 'कार्टमा थप्नुहोस्';

  return (
    <Card 
      className="group overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] duration-300 cursor-pointer"
      onClick={() => navigate(`/product/${id}`)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground">
            {discount}% {discountText}
          </Badge>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive">{outOfStockText}</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
          {title}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < Math.floor(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({reviews})
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(price)}
          </span>
          {comparePrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(comparePrice)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full gap-2"
          variant={inStock ? "default" : "outline"}
          disabled={!inStock}
          onClick={(e) => {
            e.stopPropagation();
            // Add to cart logic here
          }}
        >
          <ShoppingCart className="h-4 w-4" />
          {addToCartText}
        </Button>
      </CardFooter>
    </Card>
  );
};
