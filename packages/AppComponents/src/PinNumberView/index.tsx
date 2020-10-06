import React, { FC } from "react";
import map from "lodash/map";
import toString from "lodash/toString";
import { Row, Col } from "antd";
import { Wrapper } from "./styles";

// ======================= PROPS
interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  pin: string;
}

const PinNumberViewComponent: FC<Props> = ({ pin, className }) => {
  // ======================= HELPERS
  const pins = map(toString(pin));

  // ======================= VIEWS
  if (pins.length === 0) {
    return null;
  }

  return (
    <Wrapper className={className}>
      <Row>
        {map(pins, (e, i) => (
          <Col key={`${e}-${i}`} flex="auto">
            {e}
          </Col>
        ))}
      </Row>
    </Wrapper>
  );
};

export const PinNumberView = PinNumberViewComponent;

export default PinNumberViewComponent;
