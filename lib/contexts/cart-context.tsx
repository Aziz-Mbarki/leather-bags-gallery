"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { CartItem, Product } from "@/lib/types"
import { useRouter } from "next/navigation"

interface CartContextType {
  items: (CartItem & { product: Product })[]
  itemCount: number
  totalAmount: number
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  isLoading: boolean
  error: string | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<(CartItem & { product: Product })[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Calculate derived values
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  // Load cart items on mount and auth changes
  useEffect(() => {
    loadCartItems()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        loadCartItems()
      } else if (event === "SIGNED_OUT") {
        setItems([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadCartItems = async () => {
    try {
      setIsLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setItems([])
        return
      }

      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          *,
          product:products(*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (err) {
      console.error("Error loading cart:", err)
      setError(err instanceof Error ? err.message : "Failed to load cart")
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      setIsLoading(true)
      setError(null)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      // Check if item already exists in cart
      const existingItem = items.find((item) => item.product_id === productId)

      if (existingItem) {
        // Update quantity
        await updateQuantity(existingItem.id, existingItem.quantity + quantity)
      } else {
        // Add new item
        const { error } = await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: productId,
          quantity,
        })

        if (error) throw error
        await loadCartItems()
      }
    } catch (err) {
      console.error("Error adding to cart:", err)
      setError(err instanceof Error ? err.message : "Failed to add to cart")
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

      if (error) throw error
      setItems(items.filter((item) => item.id !== itemId))
    } catch (err) {
      console.error("Error removing from cart:", err)
      setError(err instanceof Error ? err.message : "Failed to remove from cart")
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setIsLoading(true)
      setError(null)

      if (quantity <= 0) {
        await removeFromCart(itemId)
        return
      }

      const { error } = await supabase
        .from("cart_items")
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq("id", itemId)

      if (error) throw error

      setItems(items.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
    } catch (err) {
      console.error("Error updating quantity:", err)
      setError(err instanceof Error ? err.message : "Failed to update quantity")
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id)

      if (error) throw error
      setItems([])
    } catch (err) {
      console.error("Error clearing cart:", err)
      setError(err instanceof Error ? err.message : "Failed to clear cart")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalAmount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoading,
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
