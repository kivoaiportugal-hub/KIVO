export interface PlatformConfig {
  id: string;
  name: string;
  authUrl: string;
  tokenUrl: string;
  apiUrl: string;
  scopes: string[];
}

export interface PlatformToken {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  token_type: string;
}

export interface PlatformMenuItem {
  external_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image_url?: string;
}

export interface PlatformOrder {
  external_id: string;
  status: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  customer_name?: string;
  ordered_at: string;
  delivered_at?: string;
}

export interface PlatformReview {
  external_id: string;
  rating: number;
  text: string;
  author_name: string;
  reviewed_at: string;
  sentiment?: string;
}

export interface PlatformFinancials {
  date: string;
  revenue: number;
  orders_count: number;
  avg_ticket: number;
  commissions: number;
  net: number;
}

export interface PlatformConnector {
  getAuthUrl(restaurantId: string, redirectUri: string): string;
  handleCallback(code: string, restaurantId: string): Promise<PlatformToken>;
  refreshToken(refreshToken: string): Promise<PlatformToken>;
  getMenuItems(accessToken: string): Promise<PlatformMenuItem[]>;
  getOrders(accessToken: string, since?: string): Promise<PlatformOrder[]>;
  getReviews(accessToken: string): Promise<PlatformReview[]>;
  getFinancials(accessToken: string, since?: string): Promise<PlatformFinancials[]>;
}
