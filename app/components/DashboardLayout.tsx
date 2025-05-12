// components/DashboardLayout.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface SessionData {
  id: string;
  user: {
    name: string;
    email: string;
  };
  resultType: string;
  createdAt: string;
}

interface DashboardLayoutProps {
  children?: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);

  useEffect(() => {
    axios.get<SessionData[]>("/api/sesi").then((res) => setSessions(res.data));
  }, []);

  const filteredSessions = sessions.filter((s) => s.user.name.toLowerCase().includes(search.toLowerCase()) || s.user.email.toLowerCase().includes(search.toLowerCase()) || s.resultType.toLowerCase().includes(search.toLowerCase()));

  const handleExportPDF = () => {
    const table = document.getElementById("pdfTable");
    if (!table) return;
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("data_sesi_siswa.pdf");
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col border-r">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">Tes Minat Bakat</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm">
          <Link href="/guru" className="block px-4 py-2 rounded hover:bg-blue-100">
            Dashboard
          </Link>
          <Link href="/guru/tambah-soal" className="block px-4 py-2 rounded hover:bg-blue-100">
            Manajemen Soal
          </Link>
          <Link href="/guru/laporan" className="block px-4 py-2 rounded hover:bg-blue-100">
            Laporan
          </Link>
        </nav>
        <div className="p-4 border-t">
          <button className="w-full text-left text-sm text-red-500 hover:underline">Logout</button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Dashboard Guru</h2>
          <div className="text-sm">👩‍🏫 Selamat datang, Guru!</div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Informasi Ringkas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
              <h3 className="text-sm font-medium text-gray-600">Total Siswa</h3>
              <p className="text-2xl font-bold text-blue-600">128</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
              <h3 className="text-sm font-medium text-gray-600">Sesi Tes Hari Ini</h3>
              <p className="text-2xl font-bold text-green-600">24</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-yellow-500">
              <h3 className="text-sm font-medium text-gray-600">Tipe Terbanyak</h3>
              <p className="text-2xl font-bold text-yellow-600">INTJ</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-purple-500">
              <h3 className="text-sm font-medium text-gray-600">Soal Aktif</h3>
              <p className="text-2xl font-bold text-purple-600">42</p>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Selamat datang di Dashboard Guru 🎓</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Di sini Anda dapat memantau aktivitas siswa, melihat hasil tes mereka secara real-time, dan mengelola soal dengan mudah. Jangan lupa untuk meninjau laporan secara berkala dan perbarui soal sesuai kebutuhan pembelajaran.
            </p>
          </div>

          {/* Filter Input & Export */}
          <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <input
              type="text"
              placeholder="Cari siswa, email, atau tipe..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-80 px-4 py-2 rounded border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button onClick={handleExportPDF} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
              Export PDF
            </button>
          </div>

          {/* Tabel Sesi Siswa */}
          <div className="bg-white rounded-xl shadow overflow-auto" id="pdfTable">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-blue-600">Nama</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-blue-600">Email</th>
                  <th className="px-4 py-2 text-sm font-semibold text-blue-600">Tipe</th>
                  <th className="px-4 py-2 text-sm font-semibold text-blue-600">Waktu Tes</th>
                  <th className="px-4 py-2 text-sm font-semibold text-blue-600">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filteredSessions.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap">{s.user.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{s.user.email}</td>
                    <td className="px-4 py-2 text-center font-medium text-indigo-600">{s.resultType}</td>
                    <td className="px-4 py-2 text-center">{new Date(s.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2 text-center">
                      <button onClick={() => setSelectedSession(s)} className="text-blue-600 hover:underline text-sm">
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal Detail */}
          {selectedSession && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
              <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
                <h3 className="text-lg font-semibold mb-2 text-blue-600">Detail Sesi Siswa</h3>
                <p className="text-sm mb-1">
                  <strong>Nama:</strong> {selectedSession.user.name}
                </p>
                <p className="text-sm mb-1">
                  <strong>Email:</strong> {selectedSession.user.email}
                </p>
                <p className="text-sm mb-1">
                  <strong>Tipe Kepribadian:</strong> {selectedSession.resultType}
                </p>
                <p className="text-sm mb-4">
                  <strong>Waktu Tes:</strong> {new Date(selectedSession.createdAt).toLocaleString()}
                </p>
                <button onClick={() => setSelectedSession(null)} className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 w-full">
                  Tutup
                </button>
              </div>
            </div>
          )}

          {children}
        </div>
      </main>
    </div>
  );
}
