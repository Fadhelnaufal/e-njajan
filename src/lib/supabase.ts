import { createClient } from "@supabase/supabase-js";
import { MenuItem, Order, CanteenSettings } from "../types";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://pijdjdlnnbzpvdawhlvv.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpamRqZGxubmJ6cHZkYXdobHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMTIxNDksImV4cCI6MjEwNzc4ODE0OX0.oq-jktFF1PaOU11NXfcGzz2pY170sJgHRUzxAQTapBk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Map Supabase DB snake_case row to App MenuItem type
export function mapDbToMenuItem(row: {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuItem["category"];
  stock: number;
  is_active: boolean;
  image: string;
  emoji: string;
  is_popular?: boolean;
}): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    stock: Number(row.stock),
    isActive: Boolean(row.is_active),
    image: row.image,
    emoji: row.emoji,
    isPopular: Boolean(row.is_popular),
  };
}

// Map App MenuItem to Supabase DB snake_case row
export function mapMenuItemToDb(item: MenuItem) {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    stock: item.stock,
    is_active: item.isActive,
    image: item.image,
    emoji: item.emoji,
    is_popular: item.isPopular ?? false,
  };
}

// Map Supabase DB snake_case row to App Order type
export function mapDbToOrder(row: {
  id: string;
  created_at: string;
  customer_name: string;
  customer_role?: string;
  items: Order["items"];
  subtotal: number;
  delivery_fee: number;
  total: number;
  fulfillment_method: Order["fulfillmentMethod"];
  delivery_location?: string;
  order_status: Order["orderStatus"];
  payment_method: Order["paymentMethod"];
  payment_status: Order["paymentStatus"];
  payment_confirmed_at?: string;
  is_demo_sample?: boolean;
}): Order {
  return {
    id: row.id,
    createdAt: row.created_at,
    customerName: row.customer_name,
    customerRole: row.customer_role || "user",
    items: typeof row.items === "string" ? JSON.parse(row.items) : row.items,
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee),
    total: Number(row.total),
    fulfillmentMethod: row.fulfillment_method,
    deliveryLocation: row.delivery_location || undefined,
    orderStatus: row.order_status,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    paymentConfirmedAt: row.payment_confirmed_at || undefined,
    isDemoSample: Boolean(row.is_demo_sample),
  };
}

// Map App Order to Supabase DB snake_case row
export function mapOrderToDb(order: Order) {
  return {
    id: order.id,
    created_at: order.createdAt,
    customer_name: order.customerName,
    customer_role: order.customerRole || "user",
    items: order.items,
    subtotal: order.subtotal,
    delivery_fee: order.deliveryFee,
    total: order.total,
    fulfillment_method: order.fulfillmentMethod,
    delivery_location: order.deliveryLocation || null,
    order_status: order.orderStatus,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    payment_confirmed_at: order.paymentConfirmedAt || null,
    is_demo_sample: order.isDemoSample ?? false,
  };
}

// Map Supabase DB row to App CanteenSettings type
export function mapDbToSettings(row: {
  canteen_name: string;
  delivery_fee: number;
  is_service_active: boolean;
}): CanteenSettings {
  return {
    canteenName: row.canteen_name,
    deliveryFee: Number(row.delivery_fee),
    isServiceActive: Boolean(row.is_service_active),
  };
}

export type DbMenuRow = Parameters<typeof mapDbToMenuItem>[0];
export type DbOrderRow = Parameters<typeof mapDbToOrder>[0];
export type DbSettingsRow = Parameters<typeof mapDbToSettings>[0];
