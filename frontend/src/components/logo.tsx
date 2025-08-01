export default function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      {/* Minimal civic report symbol: location pin with a dot */}
      <path
        d="M16 5
           C11.58 5 8 8.58 8 13
           c0 5.25 7.2 13.1 7.53 13.43
           a1 1 0 0 0 1.41 0
           C16.8 26.1 24 18.25 24 13
           c0-4.42-3.58-8-8-8z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="16" cy="13" r="3" fill="currentColor" />
    </svg>
  );
}
