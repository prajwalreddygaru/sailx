export type UserRole = "BUYER" | "AGENT" | "SUPPLIER" | "ADMIN";

export type RFQStatus =
  | "DRAFT"
  | "PENDING"
  | "SOURCING"
  | "QUOTATIONS_RECEIVED"
  | "SAMPLE_STAGE"
  | "PRODUCTION"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PRODUCTION"
  | "READY_TO_SHIP"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type ShipmentStatus =
  | "PREPARING"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "AT_PORT"
  | "CUSTOMS"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  country?: string;
  phone?: string;
  gst?: string;
  verified?: boolean;
}

export interface RFQ {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  moq: number;
  budget: number;
  currency: string;
  deliveryTimeline: string;
  status: RFQStatus;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  agentId?: string;
  agentName?: string;
  createdAt: string;
  updatedAt: string;
  attachments: number;
  quotations: number;
  priority: "LOW" | "MEDIUM" | "HIGH";
  imageUrl?: string;
}

export interface Quotation {
  id: string;
  rfqId: string;
  rfqTitle: string;
  supplierId: string;
  supplierName: string;
  supplierCountry: string;
  supplierRating: number;
  agentId: string;
  agentName: string;
  unitPrice: number;
  moq: number;
  leadTime: string;
  totalPrice: number;
  currency: string;
  certifications: string[];
  notes: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "NEGOTIATING";
  createdAt: string;
  validUntil: string;
}

export interface Supplier {
  id: string;
  name: string;
  factoryName: string;
  country: string;
  city: string;
  rating: number;
  trustScore: number;
  yearsActive: number;
  totalOrders: number;
  certifications: string[];
  categories: string[];
  verified: boolean;
  exportLicense: string;
  imageUrl: string;
  responseTime: string;
}

export interface Order {
  id: string;
  code: string;
  rfqId: string;
  buyerId: string;
  supplierName: string;
  productTitle: string;
  quantity: number;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  shipmentStatus: ShipmentStatus;
  paymentStatus: "PENDING" | "PARTIAL" | "PAID";
  createdAt: string;
  expectedDelivery: string;
  progress: number;
}

export interface Shipment {
  id: string;
  orderId: string;
  orderCode: string;
  trackingNumber: string;
  carrier: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  eta: string;
  containerType: string;
  weight: string;
  events: ShipmentEvent[];
}

export interface ShipmentEvent {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantRole: UserRole;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
  online: boolean;
  rfqCode?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  attachments?: { name: string; type: string; url: string }[];
  createdAt: string;
  read: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "RFQ" | "QUOTATION" | "SHIPMENT" | "MESSAGE" | "MEETING" | "SYSTEM";
  read: boolean;
  createdAt: string;
  href?: string;
}

export interface Sample {
  id: string;
  rfqId: string;
  productTitle: string;
  supplierName: string;
  status: "REQUESTED" | "SHIPPED" | "DELIVERED" | "APPROVED" | "REJECTED";
  trackingNumber: string;
  qualityScore: number;
  requestedAt: string;
  receivedAt?: string;
  notes?: string;
}
