interface OrderData {
  orderId: string
  customerName: string
  customerPhone: string
  customerLocation: string
  totalAmount: number
  items: Array<{
    productName: string
    quantity: number
    price: number
  }>
  createdAt: string
}

export async function addOrderToGoogleSheets(orderData: OrderData): Promise<number | null> {
  try {
    const response = await fetch("/api/google-sheets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      throw new Error("Failed to add order to Google Sheets")
    }

    const result = await response.json()
    return result.rowNumber
  } catch (error) {
    console.error("Error adding order to Google Sheets:", error)
    return null
  }
}
