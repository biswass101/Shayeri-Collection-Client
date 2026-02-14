import { Button } from "@/components/ui/button";
import type { Category } from "@/features/home/homeTypes";

type CategoryRowProps = {
  categories: Category[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
};

export default function CategoryRow({ categories, selectedCategory, onSelect }: CategoryRowProps) {
  return (
    <div className="category-row">
      {categories.map((category) => (
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
