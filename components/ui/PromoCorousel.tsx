import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface PromoAd {
  id: number;
  title: string;
  description: string;
  gradient?: string;
  buttonText?: string;
}

interface PromoCarouselProps {
  ads: PromoAd[];
}

const defaultAds: PromoAd[] = [
  {
    id: 1,
    title: "Fresh Summer Sale!",
    description: "Get 25% off on tropical fruits",
    gradient: "gradient-tropical",
    buttonText: "Shop Now"
  },
  {
    id: 2,
    title: "Berry Special Offer",
    description: "Buy 2 get 1 free on all berries",
    gradient: "gradient-berry",
    buttonText: "Claim Deal"
  },
  {
    id: 3,
    title: "Organic Collection",
    description: "100% certified organic fruits",
    gradient: "gradient-fresh",
    buttonText: "Explore"
  }
];

const PromoCarousel = ({ ads = defaultAds }: PromoCarouselProps) => {
  return (
    <div className="mb-8">
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {ads.map((ad) => (
          <Card 
            key={ad.id} 
            className={`flex-shrink-0 w-72 h-40 bg-${ad.gradient} border-0 overflow-hidden group cursor-pointer hover:shadow-glow transition-all duration-300 transform hover:scale-105`}
          >
            <CardContent className="p-6 h-full flex flex-col justify-between text-primary-foreground relative">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2 text-white drop-shadow-sm">
                  {ad.title}
                </h3>
                <p className="text-white/90 text-sm leading-relaxed drop-shadow-sm">
                  {ad.description}
                </p>
              </div>
              
              {ad.buttonText && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="relative z-10 self-start bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm group/button"
                >
                  {ad.buttonText}
                  <ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover/button:translate-x-1" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PromoCarousel;