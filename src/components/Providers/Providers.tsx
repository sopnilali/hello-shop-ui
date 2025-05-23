'use client';

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/components/Redux/store";
import LoadingSpinner from "../Shared/LoadingSpinner";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <>
          {children}
          <Toaster
            position="top-center"
            duration={2000}
          />
        </>
      </PersistGate>
    </Provider>
  );
};
