import styled from "styled-components";

type FlexDirection = "column" | "column-reverse" | "row" | "row-reverse";
type JustifyContent =
  | "center"
  | "space-between"
  | "space-around"
  | "flex-start"
  | "flex-end";
type AlignContent =
  | "center"
  | "baseline"
  | "start"
  | "flex-start"
  | "flex-end"
  | "initial";

export const StyledFlex = styled.div<{
  direction?: FlexDirection;
  justify?: JustifyContent;
  align?: AlignContent;
  width?: string;
  height?: string;
}>`
  display: flex;
  flex-direction: ${(props) => props.direction ?? "row"};
  justify-content: ${(props) => props.justify ?? "space-between"};
  align-items: ${(props) => props.align ?? "center"};
  width: ${(props) => props.width ?? "100%"};
  height: ${(props) => props.height ?? "initial"};
`;

export const StyledContainer = styled.div<{ width: string }>`
  width: ${(props) => props.width};
  margin: auto;
`;
