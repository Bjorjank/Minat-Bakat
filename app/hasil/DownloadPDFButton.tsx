// app/hasil/DownloadPDFButton.tsx
"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Props {
  resultType: string;
}

export default function DownloadPDFButton({ resultType }: Props) {
  const downloadPDF = async () => {
    const element = document.getElementById("hasilTes");
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`hasil-tes-${resultType}.pdf`);
  };

  return (
    <button onClick={downloadPDF} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
      🖨️ Download PDF
    </button>
  );
}
