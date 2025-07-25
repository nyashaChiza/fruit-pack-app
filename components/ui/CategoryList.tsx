import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: number;
  name: string;
  icon: string;
  count?: number;
}

interface CategoryListProps {
  categories: Category[];
  selectedCategory?: number;
  onCategorySelect?: (categoryId: number) => void;
}

const CategoryList = ({ categories, selectedCategory, onCategorySelect }: CategoryListProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-foreground mb-4">Categories</h2>
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`flex-shrink-0 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-fresh ${
              selectedCategory === category.id 
                ? 'ring-2 ring-primary shadow-fresh' 
                : 'hover:shadow-md'
            }`}
            onClick={() => onCategorySelect?.(category.id)}
          >
            <CardContent className="p-4 text-center min-w-[80px]">
              <div className="text-2xl mb-2 transition-transform duration-300 group-hover:scale-110">
                {category.icon}
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1 whitespace-nowrap">
                {category.name}
              </h3>
              {category.count && (
                <Badge variant="secondary" className="text-xs bg-muted">
                  {category.count}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;