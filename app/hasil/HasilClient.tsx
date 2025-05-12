// app/hasil/HasilClient.tsx
"use client";

import DownloadPDFButton from "./DownloadPDFButton";

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

interface Props {
  session: Session;
  results: Result[];
}

export default function HasilClient({ session, results }: Props) {
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
