"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginGuru() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    const res = await fetch("/api/guru-login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    if (data.success) {
      // Simpan token JWT di localStorage/sessionStorage
      localStorage.setItem("guru-token", data.token);
      router.push("/guru");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Login Guru</h1>
      <input className="border px-3 py-2 w-full mb-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input className="border px-3 py-2 w-full mb-4" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" onClick={login}>
        Masuk
      </button>
    </div>
  );
}
