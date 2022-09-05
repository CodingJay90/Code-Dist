import { useState, useEffect, useRef } from "react";

const useOnClickOutside = (onTrigger: () => void) => {
  const componentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: any) {
      if (componentRef && componentRef.current) {
        // debugger;
        const ref: any = componentRef.current;
        if (!ref.contains(e.target)) {
          onTrigger();
        }
      }
    }
    document.addEventListener("click", handleClick, { capture: true });
    // document.removeEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
  }, []);
  return componentRef;
};

export default useOnClickOutside;
