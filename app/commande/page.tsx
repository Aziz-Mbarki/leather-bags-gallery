"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, MapPin, Phone, User, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/lib/contexts/cart-context"
import { TUNISIAN_GOVERNORATES } from "@/lib/types"
import { addOrderToGoogleSheets } from "@/lib/google-sheets"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface OrderFormData {
  customerName: string
  customerPhone: string
  customerLocation: string
}

export default function CommandePage() {
  const { items, totalAmount, clearCart, isLoading: cartLoading } = useCart()
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: "",
    customerPhone: "",
    customerLocation: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<OrderFormData>>({})
  const router = useRouter()
  const supabase = createClient()

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} TND`
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<OrderFormData> = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Le nom est requis"
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "Le numéro de téléphone est requis"
    } else if (!/^[0-9+\-\s()]{8,}$/.test(formData.customerPhone.trim())) {
      newErrors.customerPhone = "Numéro de téléphone invalide"
    }

    if (!formData.customerLocation) {
      newErrors.customerLocation = "Le gouvernorat est requis"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return
    if (items.length === 0) return

    setIsSubmitting(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          customer_name: formData.customerName.trim(),
          customer_phone: formData.customerPhone.trim(),
          customer_location: formData.customerLocation,
          total_amount: totalAmount,
          status: "pending",
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      try {
        const googleSheetsData = {
          orderId: order.id,
          customerName: formData.customerName.trim(),
          customerPhone: formData.customerPhone.trim(),
          customerLocation: formData.customerLocation,
          totalAmount: totalAmount,
          items: items.map((item) => ({
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
          createdAt: order.created_at,
        }

        const rowNumber = await addOrderToGoogleSheets(googleSheetsData)

        // Update order with Google Sheets row number
        if (rowNumber) {
          await supabase.from("orders").update({ google_sheet_row: rowNumber }).eq("id", order.id)
        }
      } catch (googleSheetsError) {
        console.error("Google Sheets integration failed:", googleSheetsError)
        // Don't fail the order if Google Sheets fails
      }

      // Clear cart
      await clearCart()

      // Redirect to success page
      router.push(`/commande/success?order=${order.id}`)
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Erreur lors de la création de la commande. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center gap-4 mb-8">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Commande</h1>
            </div>
            <Card>
              <CardContent className="p-8">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-6">Votre panier est vide</p>
                <Link href="/">
                  <Button>Continuer les achats</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/panier">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Finaliser la commande</h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Informations de livraison</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">
                        <User className="h-4 w-4 inline mr-2" />
                        Nom complet *
                      </Label>
                      <Input
                        id="customerName"
                        type="text"
                        placeholder="Votre nom complet"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange("customerName", e.target.value)}
                        className={errors.customerName ? "border-red-500" : ""}
                      />
                      {errors.customerName && <p className="text-sm text-red-500">{errors.customerName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">
                        <Phone className="h-4 w-4 inline mr-2" />
                        Numéro de téléphone *
                      </Label>
                      <Input
                        id="customerPhone"
                        type="tel"
                        placeholder="Ex: +216 12 345 678"
                        value={formData.customerPhone}
                        onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                        className={errors.customerPhone ? "border-red-500" : ""}
                      />
                      {errors.customerPhone && <p className="text-sm text-red-500">{errors.customerPhone}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerLocation">
                        <MapPin className="h-4 w-4 inline mr-2" />
                        Gouvernorat *
                      </Label>
                      <Select
                        value={formData.customerLocation}
                        onValueChange={(value) => handleInputChange("customerLocation", value)}
                      >
                        <SelectTrigger className={errors.customerLocation ? "border-red-500" : ""}>
                          <SelectValue placeholder="Sélectionnez votre gouvernorat" />
                        </SelectTrigger>
                        <SelectContent>
                          {TUNISIAN_GOVERNORATES.map((governorate) => (
                            <SelectItem key={governorate} value={governorate}>
                              {governorate}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.customerLocation && <p className="text-sm text-red-500">{errors.customerLocation}</p>}
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Informations de livraison</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Livraison gratuite dans toute la Tunisie</li>
                        <li>• Délai de livraison: 2-5 jours ouvrables</li>
                        <li>• Paiement à la livraison disponible</li>
                      </ul>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || cartLoading}>
                      {isSubmitting ? "Traitement..." : "Confirmer la commande"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Résumé de la commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item.product.image_url || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                          <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                          <p className="text-sm font-semibold text-primary">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr />

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span>{formatPrice(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livraison</span>
                      <span className="text-green-600">Gratuite</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(totalAmount)}</span>
                    </div>
                  </div>

                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      En passant cette commande, vous acceptez nos conditions de vente.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
