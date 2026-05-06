"use client";

import { useEffect, useState } from "react";

export function useClientSearchParams(): URLSearchParams {
  const [params, setParams] = useState<URLSearchParams>(() => new URLSearchParams());

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
  }, []);

  return params;
}
