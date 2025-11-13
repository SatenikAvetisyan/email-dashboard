"use client";
import React from "react";
import LoginForm from "../../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-12">
      <h2 className="text-2xl mb-4">Iniciar sesión</h2>
      <LoginForm />
    </div>
  );
}
