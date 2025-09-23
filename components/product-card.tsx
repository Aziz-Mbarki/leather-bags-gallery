"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/lib/contexts/cart-context"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { addToCart, isLoading } = useCart()

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} TND`
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await addToCart(product.id)
  }

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Overlay Actions */}
          <div
            className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
          >
            <div className="absolute top-3 right-3">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsLiked(!isLiked)
                }}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Sale Badge */}
          {product.original_price && (
            <div className="absolute top-3 left-3">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">PROMO</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.name}</h3>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            {product.original_price && (
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.original_price)}</span>
            )}
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isLoading ? "Ajout..." : "Ajouter au panier"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
