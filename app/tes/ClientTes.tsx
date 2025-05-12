"use client";

import { useState } from "react";
import AnswerScale from "../components/AnswerScale"; // pastikan path ini sesuai

export default function ClientTes({ questions }: { questions: any[] }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswer = async (value: number) => {
    const nextAnswers = [...answers, value];
    setAnswers(nextAnswers);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      try {
        const res = await fetch("/api/submit", {
          method: "POST",
          body: JSON.stringify({
            userId: "1e5866ee-88d2-4ae9-aeaf-9447fd717196", // pastikan ID ini valid di DB
            answers: nextAnswers,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        console.log("Data Hasil Submit:", data);

        if (data?.sessionId) {
          window.location.href = `/hasil?id=${data.sessionId}`;
        } else {
          alert("Gagal menyimpan hasil. Cek API /submit.");
        }
      } catch (error) {
        console.error("Error submit:", error);
        alert("Terjadi error saat submit!");
      }
    }
  };

  const progress = Math.round(((index + 1) / questions.length) * 100);

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <div className="text-sm mb-2 text-gray-500">
        Pertanyaan {index + 1} dari {questions.length}
      </div>
      <div className="w-full bg-gray-200 h-2 rounded">
        <div className="bg-blue-500 h-2 rounded" style={{ width: `${progress}%` }} />
      </div>

      <h2 className="mt-6 text-lg font-semibold">{questions[index].text}</h2>
      <AnswerScale onSelect={handleAnswer} />
    </div>
  );
}
