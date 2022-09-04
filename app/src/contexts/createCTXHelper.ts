import React from "react";

export function createCtx<A>() {
  const ctx = React.createContext<A | undefined>(undefined);
  function useCtx() {
    const c = React.useContext(ctx);
    if (!c) throw new Error("useContext must be wrapped in a provider");
    return c;
  }
  return [useCtx, ctx.Provider] as const;
}
