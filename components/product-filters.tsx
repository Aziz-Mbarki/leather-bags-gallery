"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface ProductFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  priceRange: number[]
  onPriceRangeChange: (range: number[]) => void
}

const categories = [
  { id: "tous", label: "Tous les produits", count: 27 },
  { id: "homme", label: "Homme", count: 12 },
  { id: "femme", label: "Femme", count: 8 },
  { id: "sacs-a-dos", label: "Sacs à dos", count: 4 },
  { id: "portefeuilles", label: "Portefeuilles", count: 6 },
  { id: "accessoires", label: "Accessoires", count: 3 },
]

export default function ProductFilters({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
}: ProductFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Collections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              className="w-full justify-between text-left"
              onClick={() => onCategoryChange(category.id)}
            >
              <span>{category.label}</span>
              <span className="text-xs text-muted-foreground">({category.count})</span>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Prix</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={onPriceRangeChange}
              max={500000}
              min={0}
              step={10000}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{priceRange[0].toLocaleString()} TND</span>
            <span>{priceRange[1].toLocaleString()} TND</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
