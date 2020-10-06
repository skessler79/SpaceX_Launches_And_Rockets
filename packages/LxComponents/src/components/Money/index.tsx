import React from "react";
import { formatCurrency } from "@lavax-ui/helpers";
import { Props } from "./props";

const MoneyComponent: React.FC<Props> = (props) => {
  const { amount, format, currency, defaultCurrency } = props;
  return <>{formatCurrency(amount, currency || defaultCurrency, format)}</>;
};

MoneyComponent.defaultProps = {
  amount: 0,
  format: "0,0.00",
  currency: null,
  defaultCurrency: "MYR"
};

export const Money = MoneyComponent;
export default Money;
