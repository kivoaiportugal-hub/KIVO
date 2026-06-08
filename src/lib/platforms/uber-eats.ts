import type { PlatformConnector, PlatformToken, PlatformMenuItem, PlatformOrder, PlatformReview, PlatformFinancials } from "./types";

const UBER_EATS_CONFIG = {
  id: "uber_eats",
  name: "Uber Eats",
  authUrl: "https://auth.uber.com/v2/authorize",
  tokenUrl: "https://auth.uber.com/v2/token",
  apiUrl: "https://api.uber.com/v1",
  scopes: ["eats.orders", "eats.store", "eats.reviews", "eats.financials"],
};

export class UberEatsConnector implements PlatformConnector {
  private config = UBER_EATS_CONFIG;

  getAuthUrl(restaurantId: string, redirectUri: string): string {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.UBER_EATS_CLIENT_ID!,
      redirect_uri: redirectUri,
      scope: this.config.scopes.join(" "),
      state: restaurantId,
    });
    return `${this.config.authUrl}?${params}`;
  }

  async handleCallback(code: string, restaurantId: string): Promise<PlatformToken> {
    const response = await fetch(this.config.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.UBER_EATS_CLIENT_ID!,
        client_secret: process.env.UBER_EATS_CLIENT_SECRET!,
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/platforms/uber-eats/callback`,
      }),
    });

    const data = await response.json();
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + data.expires_in * 1000,
      token_type: data.token_type,
    };
  }

  async refreshToken(refreshToken: string): Promise<PlatformToken> {
    const response = await fetch(this.config.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.UBER_EATS_CLIENT_ID!,
        client_secret: process.env.UBER_EATS_CLIENT_SECRET!,
        refresh_token: refreshToken,
      }),
    });

    const data = await response.json();
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token || refreshToken,
      expires_at: Date.now() + data.expires_in * 1000,
      token_type: data.token_type,
    };
  }

  async getMenuItems(accessToken: string): Promise<PlatformMenuItem[]> {
    const storeId = process.env.UBER_EATS_STORE_ID;
    const response = await fetch(`${this.config.apiUrl}/eats/stores/${storeId}/menus`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();
    return (data.menu?.items || []).map((item: any) => ({
      external_id: item.id,
      name: item.title,
      description: item.description || "",
      price: item.price / 100,
      category: item.category_name || "Geral",
      available: item.is_available !== false,
      image_url: item.image_url,
    }));
  }

  async getOrders(accessToken: string, since?: string): Promise<PlatformOrder[]> {
    const storeId = process.env.UBER_EATS_STORE_ID;
    const params = new URLSearchParams({ limit: "50" });
    if (since) params.set("created_after", since);

    const response = await fetch(`${this.config.apiUrl}/eats/stores/${storeId}/orders?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();
    return (data.orders || []).map((order: any) => ({
      external_id: order.id,
      status: order.status,
      total: order.total_amount / 100,
      items: (order.items || []).map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price / 100,
      })),
      customer_name: order.customer?.name,
      ordered_at: order.created_at,
      delivered_at: order.delivered_at,
    }));
  }

  async getReviews(accessToken: string): Promise<PlatformReview[]> {
    const storeId = process.env.UBER_EATS_STORE_ID;
    const response = await fetch(`${this.config.apiUrl}/eats/stores/${storeId}/reviews`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();
    return (data.reviews || []).map((review: any) => ({
      external_id: review.id,
      rating: review.rating,
      text: review.comment || "",
      author_name: review.reviewer_name || "Anónimo",
      reviewed_at: review.created_at,
    }));
  }

  async getFinancials(accessToken: string, since?: string): Promise<PlatformFinancials[]> {
    const storeId = process.env.UBER_EATS_STORE_ID;
    const params = new URLSearchParams({ period: "daily" });
    if (since) params.set("start_date", since);

    const response = await fetch(`${this.config.apiUrl}/eats/stores/${storeId}/financials?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();
    return (data.financials || []).map((f: any) => ({
      date: f.date,
      revenue: f.gross_revenue / 100,
      orders_count: f.order_count,
      avg_ticket: f.average_order_value / 100,
      commissions: f.uber_commission / 100,
      net: f.net_payout / 100,
    }));
  }
}
