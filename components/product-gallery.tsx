"use client"

import { useState, useEffect } from "react"
import ProductCard from "./product-card"
import ProductFilters from "./product-filters"
import { createClient } from "@/lib/supabase/client"
import type { Product } from "@/lib/types"

export default function ProductGallery() {
  const [selectedCategory, setSelectedCategory] = useState("tous")
  const [priceRange, setPriceRange] = useState([0, 500000])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setProducts(data || [])
    } catch (err) {
      console.error("Error fetching products:", err)
      setError(err instanceof Error ? err.message : "Failed to load products")
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategory === "tous" || product.category === selectedCategory
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
    return categoryMatch && priceMatch
  })

  if (isLoading) {
    return (
      <div className="animate-fade-in-up">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Collection Cuir Premium</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Chargement des produits...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="animate-fade-in-up">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Collection Cuir Premium</h2>
          <p className="text-lg text-red-500 max-w-2xl mx-auto">Erreur lors du chargement des produits: {error}</p>
          <button
            onClick={fetchProducts}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Collection Cuir Premium</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Découvrez notre sélection exclusive de sacs en cuir véritable, alliant élégance intemporelle et savoir-faire
          artisanal.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <ProductFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""} trouvé
              {filteredProducts.length > 1 ? "s" : ""}
            </p>
          </div>

          {filteredProducts.length === 0 && products.length > 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun produit ne correspond aux filtres sélectionnés.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
