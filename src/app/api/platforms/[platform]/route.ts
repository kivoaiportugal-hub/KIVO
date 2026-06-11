import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { platform, restaurant_id, action } = await request.json();

  if (!platform || !restaurant_id) {
    return NextResponse.json({ error: "Missing platform or restaurant_id" }, { status: 400 });
  }

  // Mock: return fake platform data
  const mockData: Record<string, any> = {
    menu: [
      { external_id: "1", name: "Pizza Margherita", price: 12.90, category: "Pizzas", available: true },
      { external_id: "2", name: "Francesinha", price: 14.50, category: "Pratos", available: true },
    ],
    orders: [
      { external_id: "ORD-001", status: "delivered", total: 25.80, platform, ordered_at: new Date().toISOString() },
    ],
    reviews: [
      { external_id: "REV-001", rating: 5, text: "Excelente!", author_name: "Cliente", reviewed_at: new Date().toISOString() },
    ],
    financials: { total_revenue: 2850, total_orders: 142, avg_ticket: 20.05 },
  };

  return NextResponse.json({ data: mockData[action] || [] });
}
