import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./styles/base.css";

const queryClient = new QueryClient();

const Form = lazy(() => import("./components/Form"));
const Matches = lazy(() => import("./components/Matches"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense>
        <Form />
      </Suspense>
    ),
  },
  {
    path: "/player",
    element: (
      <Suspense>
        <Matches />
      </Suspense>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
