import get from "lodash/get";
import toNumber from "lodash/toNumber";
import map from "lodash/map";
import {
  PaypalPurchasePayload,
  PaypalPaymentUser,
  PaypalPurchaseItem,
  PaypalShipping,
  PaypalAddress
} from "../@types";

const formatMoney = (value: number = 0, currency: string = "MYR") => {
  return {
    currency_code: currency, // 3 letters code. each currency treat 'value' differently
    value
  };
};

export const paypalPurchaseUnitsFactory = (
  payload: PaypalPurchasePayload,
  paypalCustomId: string | number,
  options?: { softDescriptor: string }
): any[] => {
  const { softDescriptor = "Purchase" } = options;
  const user: PaypalPaymentUser = get(payload, "user");
  const items: PaypalPurchaseItem[] = get(payload, "items", []);
  const shipping: PaypalShipping = get(payload, "shipping");
  const address: PaypalAddress = get(shipping, "address");
  const currency = get(payload, "currency", "MYR");

  const getAmount = (field) => {
    const value = get(payload, field, 0);
    return toNumber(value) ? toNumber(value) : 0;
  };

  const purchaseUnitItems = map(items, (item: PaypalPurchaseItem) => {
    return {
      name: item.name, // max 127 chars
      // https://developer.paypal.com/docs/api/orders/v2/#definition-money
      unit_amount: formatMoney(item.unitPrice, item.currency),
      tax: formatMoney(0, item.currency), // todo(tax): implement tax per item
      quantity: item.quantity,
      // description, // max 127 chars
      sku: item.sku,
      category: item.category || "PHYSICAL_GOODS"
    };
  });

  const firstPurchaseUnit = {
    reference_id: payload.id,
    description: payload.notes,
    custom_id: paypalCustomId,
    // invoice_id: payload.id // todo(invoice): need to generate an invoice upon PO
    soft_descriptor: softDescriptor,
    items: purchaseUnitItems,
    shipping: {
      address: {
        address_line_1: address.address1,
        address_line_2: address.address2,
        admin_area_2: address.city, // city, town, village
        admin_area_1: address.province, // province, state
        postal_code: address.postalCode,
        country_code: address.countryCode // two letters code
      },
      name: {
        full_name: `${user.lastName} ${user.firstName}`
      }
    },
    // todo(calculation): shipping fee, handling fee, discount, insurance
    amount: {
      currency_code: currency,
      value: payload.totalBilledAmount,
      breakdown: {
        item_total: formatMoney(getAmount("totalBilledAmount"), currency),
        handling: formatMoney(getAmount("handlingCharges"), currency),
        tax_total: formatMoney(getAmount("taxedAmount"), currency),
        insurance: formatMoney(getAmount("insurance"), currency),
        discount: formatMoney(getAmount("discountAmount"), currency),
        shipping: formatMoney(getAmount("shipping.shippingCharges"), currency),
        shipping_discount: formatMoney(
          getAmount("shipping.shippingDiscount"),
          currency
        )
      }
    }
  };

  // todo: each purchase unit ideally is coming from different merchant
  const returning = [firstPurchaseUnit];
  return returning;
};

export default {
  paypalPurchaseUnitsFactory
};

/**
const purchaseUnits = [
  {
    // reference_id: string (max 256 chars)
    // - Required for multiple purchase units (if more than 1)

    // description: string

    // custom_id: string (max 127 chars)
    // - Used to reconcile client transactions with PayPal transactions. Appears in transaction and settlement reports but is not visible to the payer.

    // invoice_id: string (max 127 chars)

    // soft_descriptor: dynamic text
    // - maybe truncated (see the paypal purchase units document)

    // items
    items: [{
      name, // max 127 chars
        // https://developer.paypal.com/docs/api/orders/v2/#definition-money
      unit_amount: {
        currency_code, // 3 letters code. each currency treat 'value' differently
        value
      },
      tax: {
        currency_code,
        value
      },
      quantity,
      description, // max 127 chars
      sku,
      category: "PHYSICAL_GOODS"
    }],

    // shipping
    // https://developer.paypal.com/docs/api/orders/v2/#definition-shipping_detail.address_portable
    shipping: {
      address: {
        address_line_1,
        address_line_2,
        admin_area_2, // city, town, village
        admin_area_1, // province, state
        postal_code,
        country_code // two letters code
      },
      name: {
        full_name
      }
    },

    amount: {
      currency_code: "USD",
      value: "0.01"
      // advanced use case:
      // eg: each different line of items are from different merchants
      // reference: https://developer.paypal.com/docs/api/orders/v2/#definition-amount_with_breakdown
      //
      breakdown: {
        item_total,
        shipping,
        handling,
        tax_total,
        insurance,
        shipping_discount,
        discount
      }
    }
  }
];
*/
