import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  console.log("ScrollToTop worked");

  useEffect(() => {
    const main = document.querySelector("main");
    if (main) main.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
