"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

function Provider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />

      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}

export default Provider;
