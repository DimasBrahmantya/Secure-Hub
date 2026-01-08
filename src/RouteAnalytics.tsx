import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { track } from "@vercel/analytics";

export default function RouteAnalytics() {
  const location = useLocation();

  useEffect(() => {
    track("pageview", {
      path: location.pathname,
    });
  }, [location]);

  return null;
}
