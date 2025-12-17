import { useEffect, useRef, RefObject } from "react";

interface UseClickOutsideProps {
  handler: () => void;
  exceptionRef?: RefObject<HTMLElement | null>;
}

export function useClickOutside<T extends HTMLElement = HTMLElement>({
  handler,
  exceptionRef,
}: UseClickOutsideProps): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (
        !ref.current ||
        ref.current.contains(event.target as Node) ||
        (exceptionRef?.current &&
          exceptionRef.current.contains(event.target as Node))
      ) {
        return;
      }

      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, exceptionRef]);

  return ref;
}
