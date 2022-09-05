import React from "react";
import { BiChevronRight } from "react-icons/bi";
import styled from "styled-components";

type Direction = "up" | "right" | "down" | "left";

const RotationMapper: { [key: string]: string } = {
  up: "rotate(180deg)",
  right: "rotate(0deg)",
  down: "rotate(90deg)",
  left: "rotate(190deg)",
};

const StyledArrowIcon = styled(BiChevronRight)<{ direction: Direction }>`
  transition: all 0.15s linear;
  transform: ${(prop) => RotationMapper[prop.direction]};
`;

const Arrow = ({
  direction,
  onClick,
}: {
  direction: Direction;
  onClick?: () => any;
}) => {
  return <StyledArrowIcon direction={direction} onClick={onClick} />;
};

export default Arrow;
