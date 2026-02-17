import { Button } from "@/components/ui/button";
import type { Category } from "@/features/home/homeTypes";

type CategoryRowProps = {
  categories: Category[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
  isLoading?: boolean;
};

const skeletonWidths = ["68px", "86px", "74px", "92px", "64px", "80px"];

export default function CategoryRow({
  categories,
  selectedCategory,
  onSelect,
  isLoading = false,
}: CategoryRowProps) {
  return (
    <div className="category-row" aria-busy={isLoading}>
      {isLoading
        ? skeletonWidths.map((width, index) => (
            <div
              key={`category-skeleton-${index}`}
              className="category-chip skeleton skeleton-chip"
              style={{ width }}
              aria-hidden="true"
            />
          ))
        : categories.map((category) => (
            <Button
              key={category.slug}
              variant={category.slug === selectedCategory ? "default" : "secondary"}
              size="sm"
              className="category-chip"
              type="button"
              onClick={() => onSelect(category.slug)}
            >
              {category.name}
            </Button>
          ))}
    </div>
  );
}
