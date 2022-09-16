import styled from "styled-components";

export const Container = styled.div`
  height: 96vh;
  max-height: 96vh;
  width: 100%;
`;
export const ViewContainer = styled.div`
  user-select: none;
  border-right: 1px solid grey;
  min-width: 230px;
  max-width: 300px;
`;
export const Grid = styled.div`
  display: grid;
  display: flex;
  grid-template-columns: 1fr 2fr 10fr;
  height: auto;
`;
