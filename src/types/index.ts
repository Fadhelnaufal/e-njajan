export type UserRole = "user" | "petugas";

export interface UserProfile {
  name: string;
  role: UserRole;
  roomOrClass?: string;
}

export type MenuCategory =
  | "semua"
  | "makanan_berat"
  | "camilan"
  | "minuman_dingin"
  | "minuman_hangat";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "makanan_berat" | "camilan" | "minuman_dingin" | "minuman_hangat";
  stock: number;
  isActive: boolean;
  image: string;
  emoji: string;
  isPopular?: boolean;
}

export interface CartItem {
  menuId: string;
  quantity: number;
}

export type OrderStatus =
  | "menunggu_konfirmasi"
  | "sedang_disiapkan"
  | "siap_diambil"
  | "dalam_pengantaran"
  | "selesai"
  | "dibatalkan";

export type PaymentMethod = "qris" | "tunai";

export type PaymentStatus =
  | "belum_dibayar"
  | "berhasil_disimulasikan"
  | "lunas"
  | "refund_disimulasikan";

export type FulfillmentMethod = "pickup" | "delivery";

export interface OrderItem {
  menuId: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerRole?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  fulfillmentMethod: FulfillmentMethod;
  deliveryLocation?: string;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentConfirmedAt?: string;
  isDemoSample?: boolean;
}

export interface CanteenSettings {
  canteenName: string;
  deliveryFee: number;
  isServiceActive: boolean;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "order_created" | "status_changed" | "order_cancelled" | "payment_confirmed";
  isRead: boolean;
}
