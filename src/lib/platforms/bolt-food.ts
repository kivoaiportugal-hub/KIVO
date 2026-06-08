import type { PlatformConnector, PlatformToken, PlatformMenuItem, PlatformOrder, PlatformReview, PlatformFinancials } from "./types";

const BOLT_FOOD_CONFIG = {
  id: "bolt_food",
  name: "Bolt Food",
  authUrl: "https://oauth.bolt.com/authorize",
  tokenUrl: "https://oauth.bolt.com/token",
  apiUrl: "https://api.bolt.com/v1",
  scopes: ["orders", "store", "reviews", "financials"],
};

export class BoltFoodConnector implements PlatformConnector {
  private config = BOLT_FOOD_CONFIG;

  getAuthUrl(restaurantId: string, redirectUri: string): string {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.BOLT_FOOD_CLIENT_ID!,
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
        client_id: process.env.BOLT_FOOD_CLIENT_ID!,
        client_secret: process.env.BOLT_FOOD_CLIENT_SECRET!,
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/platforms/bolt-food/callback`,
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
        client_id: process.env.BOLT_FOOD_CLIENT_ID!,
        client_secret: process.env.BOLT_FOOD_CLIENT_SECRET!,
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
    const storeId = process.env.BOLT_FOOD_STORE_ID;
    const response = await fetch(`${this.config.apiUrl}/stores/${storeId}/menu`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();
    return (data.categories || []).flatMap((cat: any) =>
      (cat.items || []).map((item: any) => ({
        external_id: item.id,
        name: item.name,
        description: item.description || "",
        price: item.price / 100,
        category: cat.name,
        available: item.available !== false,
        image_url: item.image_url,
      }))
    );
  }

  async getOrders(accessToken: string, since?: string): Promise<PlatformOrder[]> {
    const storeId = process.env.BOLT_FOOD_STORE_ID;
    const params = new URLSearchParams({ limit: "50" });
    if (since) params.set("since", since);

    const response = await fetch(`${this.config.apiUrl}/stores/${storeId}/orders?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();
    return (data.orders || []).map((order: any) => ({
      external_id: order.id,
      status: order.status,
      total: order.total / 100,
      items: (order.items || []).map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.unit_price / 100,
      })),
      customer_name: order.customer_name,
      ordered_at: order.created_at,
      delivered_at: order.delivered_at,
    }));
  }

  async getReviews(accessToken: string): Promise<PlatformReview[]> {
    const storeId = process.env.BOLT_FOOD_STORE_ID;
    const response = await fetch(`${this.config.apiUrl}/stores/${storeId}/reviews`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();
    return (data.reviews || []).map((review: any) => ({
      external_id: review.id,
      rating: review.rating,
      text: review.comment || "",
      author_name: review.customer_name || "Anónimo",
      reviewed_at: review.created_at,
    }));
  }

  async getFinancials(accessToken: string, since?: string): Promise<PlatformFinancials[]> {
    const storeId = process.env.BOLT_FOOD_STORE_ID;
    const params = new URLSearchParams({ period: "daily" });
    if (since) params.set("start_date", since);

    const response = await fetch(`${this.config.apiUrl}/stores/${storeId}/financials?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();
    return (data.financials || []).map((f: any) => ({
      date: f.date,
      revenue: f.gross_revenue / 100,
      orders_count: f.order_count,
      avg_ticket: f.average_order_value / 100,
      commissions: f.commission / 100,
      net: f.net_payout / 100,
    }));
  }
}
