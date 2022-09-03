import React from "react";
import { BiChevronRight } from "react-icons/bi";
import styled from "styled-components";

type Direction = "up" | "right" | "down" | "left";

const RotationMapper: { [key: string]: string } = {
  up: "rotate(90deg)",
  right: "rotate(0deg)",
  down: "rotate(180deg)",
  left: "rotate(260deg)",
};

const StyledArrowIcon = styled(BiChevronRight)<{ direction: Direction }>`
  transition: all 0.3s linear;
  transform: ${(prop) => RotationMapper[prop.direction]};
`;

const Arrow = ({ direction }: { direction: Direction }) => {
  return <StyledArrowIcon direction={direction} />;
};

export default Arrow;
