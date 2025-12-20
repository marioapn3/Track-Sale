import { useEffect, useRef } from "react";

export function ScrollToTop() {
  const previousPathname = useRef<string>(window.location.pathname);

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    };

    const interval = setInterval(() => {
      const currentPathname = window.location.pathname;
      if (previousPathname.current !== currentPathname) {
        scrollToTop();
        previousPathname.current = currentPathname;
      }
    }, 100);

    const handlePopState = () => {
      scrollToTop();
      previousPathname.current = window.location.pathname;
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      clearInterval(interval);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
}
