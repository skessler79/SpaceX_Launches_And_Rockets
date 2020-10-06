export type PaypalPaymentUser = {
  firstName: string;
  lastName: string;
};

export type PaypalPurchaseItem = {
  sku: string;
  name: string;
  unitPrice: number;
  currency: string;
  quantity: number;
  category?: string;
};

export type PaypalAddress = {
  address1: string;
  address2?: string;
  city: string;
  province: string;
  postalCode: string;
  countryCode: string;
};

export type PaypalShipping = {
  address: PaypalAddress;
  shippingCharges: number;
  shippingDiscount?: number;
};

export type PaypalPurchasePayload = {
  id: string;
  user: PaypalPaymentUser;
  notes?: string;
  currency: string;
  insurance?: number;
  taxedAmount?: number;
  discountAmount?: number;
  handlingCharges: number;
  totalBilledAmount: number;
  shipping: PaypalShipping;
  items: PaypalPurchaseItem[];
};
