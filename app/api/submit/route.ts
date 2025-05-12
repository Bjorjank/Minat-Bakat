// app/hasil/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DownloadPDFButton from "./DownloadPDFButton";
import axios from "axios";

interface Result {
  trait: string;
  score: number;
}

interface Session {
  createdAt: string;
  resultType: string;
  user: {
    name: string;
    email: string;
  };
}

export default function HasilPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("id");

  const [session, setSession] = useState<Session | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/hasil?id=${sessionId}`);
        setSession(res.data.session);
        setResults(res.data.results);
      } catch (err) {
        console.error("Gagal memuat hasil sesi", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  if (!sessionId) return <div className="text-center mt-20 text-red-600 font-semibold">Session ID tidak ditemukan.</div>;
  if (loading) return <div className="text-center mt-20">Memuat hasil sesi...</div>;
  if (!session) return <div className="text-center mt-20 text-gray-600">Sesi tidak ditemukan.</div>;

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🧾 Hasil Tes Minat & Bakat</h1>
        <DownloadPDFButton resultType={session.resultType} />
      </div>

      <div id="hasilTes">
        <p className="text-sm text-gray-600 mb-2">Waktu Tes: {new Date(session.createdAt).toLocaleString()}</p>
        <h2 className="text-lg font-semibold mb-1">Nama: {session.user.name}</h2>
        <p className="mb-4">
          Tipe Kepribadian: <span className="font-bold text-blue-600">{session.resultType}</span>
        </p>

        <h3 className="text-md font-semibold mb-2">Skor Trait:</h3>
        <ul className="list-disc ml-6">
          {results.map((res) => (
            <li key={res.trait}>
              {res.trait}: <strong>{res.score}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
