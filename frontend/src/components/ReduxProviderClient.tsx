"use client";
import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "../store/store";
import { setToken } from "../store/slices/authSlice";

/**
 * Cliente wrapper que envuelve Provider y hace la rehidratación del token desde localStorage.
 * Esto evita acceder a localStorage en tiempo de módulo (Server).
 */

export default function ReduxProviderClient({ children }: { children: React.ReactNode }) {
  return <Provider store={store}><HydrateToken>{children}</HydrateToken></Provider>;
}

function HydrateToken({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email") || undefined;
      if (token) {
        dispatch(setToken({ token, email }));
      }
    } catch (e) {
      // no hacer nada si localStorage no está disponible
      console.warn("Could not hydrate token", e);
    }
  }, [dispatch]);

  return <>{children}</>;
}