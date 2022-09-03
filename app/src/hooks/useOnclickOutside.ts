import { useState, useEffect, useRef } from "react";

const useOnClickOutside = (onTrigger: () => void) => {
  const [data, setData] = useState(null);

  const componentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: any) {
      if (componentRef && componentRef.current) {
        const ref: any = componentRef.current;
        if (!ref.contains(e.target)) {
          onTrigger();
        }
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
  return componentRef;
};

export default useOnClickOutside;
