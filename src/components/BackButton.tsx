"use client";

import { useRouter } from "next/navigation";

const ArrowLeft = ({ size = 12 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12,19 5,12 12,5" />
  </svg>
);

export default function BackButton({ label = "Voltar", size = 12, style }: {
  label?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="btn-details inline-flex items-center gap-2 font-medium flex-shrink-0"
      style={style ?? { fontSize: 12, padding: "8px 14px" }}
    >
      <ArrowLeft size={size} /> {label}
    </button>
  );
}
