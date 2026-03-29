export default function Logo({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Dark bg */}
      <rect width="100" height="100" rx="8" fill="#111" />
      {/* Subtle border */}
      <rect x="1" y="1" width="98" height="98" rx="7" stroke="#222" strokeWidth="1" fill="none" />
      {/* M */}
      <path
        d="M17 74V30L31 50L45 30V74"
        stroke="#e5e5e5"
        strokeWidth="3.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      {/* K */}
      <path
        d="M57 74V30M57 52L75 30M57 52L75 74"
        stroke="#DC143C"
        strokeWidth="3.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      {/* Accent line bottom */}
      <rect x="17" y="80" width="58" height="1.5" rx="0.75" fill="#DC143C" opacity="0.4" />
    </svg>
  );
}
