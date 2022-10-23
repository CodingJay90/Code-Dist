import React from "react";

interface IProps {
  children: JSX.Element;
  loadingFallback: JSX.Element;
  errorFallback: JSX.Element;
  loadingState: boolean;
  error: boolean;
}

const SuspenseLoader = ({
  children,
  loadingState,
  loadingFallback,
  errorFallback,
  error,
}: IProps): JSX.Element => {
  if (loadingState) return loadingFallback;
  if (error) return errorFallback;
  return children;
};

export default SuspenseLoader;
