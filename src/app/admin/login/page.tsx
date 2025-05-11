"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulasi login
    if (username === "admin" && password === "admin123") {
      alert("Login berhasil!");
      // Redirect ke halaman dashboard admin setelah login sukses
      window.location.href = "/admin/dashboard";
    } else {
      alert("Username atau password salah");
    }
  };

  return (
    <main className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center">Login Admin</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-lg">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded"
            />
          </div>
          <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
