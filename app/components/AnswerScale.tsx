"use client";

type AnswerScaleProps = {
  onSelect: (value: number) => void;
};

export default function AnswerScale({ onSelect }: AnswerScaleProps) {
  const options = [-3, -2, -1, 0, 1, 2, 3];

  return (
    <div className="flex justify-center gap-2 mt-6">
      {options.map((val, idx) => (
        <button key={idx} onClick={() => onSelect(val)} className="w-10 h-10 rounded-full hover:scale-105 transition bg-gray-200 hover:bg-blue-500 text-sm">
          {val}
        </button>
      ))}
    </div>
  );
}
