import { type NextRequest, NextResponse } from "next/server"

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

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderData = await request.json()

    const GOOGLE_SHEETS_API_KEY = process.env.GOOGLE_SHEETS_API_KEY || "AIzaSyBRL3P3FczV3HTw5DS1E3mpLbohlzDH53w"
    const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || "1IAeKGY1sXLSlm1yIj-cK0BvpLHshg2g9JyOod-XkPbw"
    const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || "Sac_info"

    if (!GOOGLE_SHEETS_API_KEY || !GOOGLE_SHEET_ID) {
      console.error("Missing Google Sheets configuration")
      return NextResponse.json({ error: "Google Sheets configuration missing" }, { status: 500 })
    }

    // Prepare the row data
    const itemsText = orderData.items
      .map((item) => `${item.productName} (x${item.quantity}) - ${item.price.toLocaleString()} TND`)
      .join("; ")

    const rowData = [
      orderData.orderId
        .slice(0, 8)
        .toUpperCase(), // Order ID (shortened)
      new Date(orderData.createdAt).toLocaleDateString("fr-FR"), // Date
      orderData.customerName,
      orderData.customerPhone,
      orderData.customerLocation,
      itemsText,
      `${orderData.totalAmount.toLocaleString()} TND`,
      "En attente", // Status
    ]

    // Google Sheets API URL
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${SHEET_NAME}:append?valueInputOption=RAW&key=${GOOGLE_SHEETS_API_KEY}`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [rowData],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Google Sheets API error:", errorText)
      throw new Error(`Google Sheets API error: ${response.status}`)
    }

    const result = await response.json()

    // Extract row number from the response
    const updatedRange = result.updates?.updatedRange || ""
    const rowMatch = updatedRange.match(/(\d+):(\d+)$/)
    const rowNumber = rowMatch ? Number.parseInt(rowMatch[1]) : null

    return NextResponse.json({
      success: true,
      rowNumber,
      message: "Order added to Google Sheets successfully",
    })
  } catch (error) {
    console.error("Error adding order to Google Sheets:", error)
    return NextResponse.json({ error: "Failed to add order to Google Sheets" }, { status: 500 })
  }
}
