"use client";
import AuthGuard from "../../components/AuthGuard";

export default function EmailsPage() {
  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto mt-20 text-center">
        <h2 className="text-2xl font-semibold mb-4">Bienvenido 🎉</h2>
        <p>Ya estás logueado correctamente.</p>
      </div>
    </AuthGuard>
  );
}