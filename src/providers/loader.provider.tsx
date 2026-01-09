"use client";

import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { useEffect, useState } from "react";

const Loaders = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <ProgressProvider height="4px" color="#0f172b" options={{ showSpinner: false }} shallowRouting>
      {children}
    </ProgressProvider>
  );
};

export default Loaders;
