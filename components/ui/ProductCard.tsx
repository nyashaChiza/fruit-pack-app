import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  description: string;
  category_name: string;
  image: string;
  rating?: number;
  reviews?: number;
}

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  cachedImages?: { [key: number]: string };
  apiBaseUrl?: string;
}

const ProductCard = ({ product, onPress, cachedImages = {}, apiBaseUrl = "" }: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = cachedImages[product.id] || 
    (apiBaseUrl ? `${apiBaseUrl}products/images/${product.image}` : product.image);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add to cart logic
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card 
      className="group overflow-hidden hover:shadow-fresh transition-all duration-300 transform hover:-translate-y-1 cursor-pointer mb-4"
      onClick={() => onPress(product)}
    >
      <div className="flex">
        {/* Product Image */}
        <div className="relative w-24 h-24 flex-shrink-0">
          {!imageError ? (
            <img 
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover rounded-l-lg transition-transform duration-300 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-fresh rounded-l-lg flex items-center justify-center">
              <span className="text-2xl">🍎</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 bg-background/80 hover:bg-background transition-all h-6 w-6"
            onClick={toggleFavorite}
          >
            <Heart 
              className={`h-3 w-3 transition-colors ${
                isFavorite ? 'fill-fruit-red text-fruit-red' : 'text-muted-foreground'
              }`} 
            />
          </Button>
        </div>

        {/* Product Info */}
        <CardContent className="flex-1 p-4 flex flex-col justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <Badge variant="secondary" className="text-xs bg-fruit-green/10 text-fruit-green">
                {product.category_name}
              </Badge>
              {product.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  <span className="text-xs font-medium">{product.rating}</span>
                  {product.reviews && (
                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                  )}
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1">
              {product.name}
            </h3>
            
            <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary">
                R{product.price?.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground">
                per {product.unit}
              </span>
            </div>
            
            <Button 
              variant="fresh" 
              size="sm" 
              className="group/button"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-1 transition-transform group-hover/button:scale-110" />
              Add
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ProductCard;