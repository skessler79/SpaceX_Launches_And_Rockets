import React from "react";
import { formatDate } from "@lavax-ui/helpers";
import { Props } from "./props";

const DateTimeComponent: React.FC<Props> = (props) => {
  const { date, kind, format, relative } = props;

  let finalFormat: string = format;
  if (kind === "date") {
    finalFormat = "Do, MMM YYYY";
  }
  if (kind === "datetime") {
    finalFormat = "Do, MMM YYYY hh:mm:A";
  }

  return <>{formatDate(date, { relative, format: finalFormat })}</>;
};

DateTimeComponent.defaultProps = {
  kind: "datetime",
  format: "Do, MMM YYYY hh:mm:A",
  relative: false
};

export const DateTime = DateTimeComponent;
export default DateTime;
