
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface FilterOption {
  value: string;
  label: string;
}

interface ProjectFiltersProps {
  categories: FilterOption[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  onResetFilters: () => void;
}

export default function ProjectFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  onResetFilters,
}: ProjectFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-8">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Filtrele:</span>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <span>Kategori</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem 
              onClick={() => {
                onCategoryChange(null);
                setIsOpen(false);
              }}
              className={cn(
                "flex items-center justify-between",
                !selectedCategory && "font-medium text-primary"
              )}
            >
              <span>Tümü</span>
              {!selectedCategory && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
            
            {categories.map((category) => (
              <DropdownMenuItem
                key={category.value}
                onClick={() => {
                  onCategoryChange(category.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between",
                  selectedCategory === category.value && "font-medium text-primary"
                )}
              >
                <span>{category.label}</span>
                {selectedCategory === category.value && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedCategory && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            {categories.find(cat => cat.value === selectedCategory)?.label || selectedCategory}
            <button 
              onClick={() => onCategoryChange(null)} 
              className="ml-1 rounded-full hover:bg-muted/60 p-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onResetFilters} 
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Tüm filtreleri temizle
          </Button>
        </div>
      )}
    </div>
  );
}
