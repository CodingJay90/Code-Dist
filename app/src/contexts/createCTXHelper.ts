import React from "react";

export function createCtx<A>() {
  const ctx = React.createContext<A | undefined>(undefined);
  function useCtx() {
    const context = React.useContext(ctx);
    if (!context) throw new Error("useContext must be wrapped in a provider");
    return context;
  }
  return [useCtx, ctx.Provider] as const;
}
