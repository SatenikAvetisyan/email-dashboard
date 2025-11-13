"use client";
import React, { useState } from "react";
import { useLoginMutation } from "../store/api";
import { useDispatch } from "react-redux";
import { setToken } from "../store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setToken({ token: res.token, email }));
      router.push("/emails");
    } catch (err) {
      const error = err && typeof err === 'object' && 'data' in err && typeof err.data === 'object' && err.data && 'error' in err.data
        ? String(err.data.error)
        : "Error iniciando sesión";
      alert(error);
    }
  }

  return (
    <form onSubmit={handle} className="bg-white p-6 rounded shadow">
      <label className="block mb-2 text-sm">Email</label>
      <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border px-3 py-2 mb-3" />
      <label className="block mb-2 text-sm">Contraseña</label>
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border px-3 py-2 mb-4" />
      <button disabled={isLoading} className="w-full bg-blue-600 text-white py-2 rounded">{isLoading ? "..." : "Entrar"}</button>
    </form>
  );
}
