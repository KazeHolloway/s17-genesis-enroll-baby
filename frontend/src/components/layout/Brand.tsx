import { Link } from "react-router-dom";

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Enroll Baby — Accueil">
      <svg viewBox="0 0 64 72" aria-hidden="true">
        <path
          d="M32 17C10-4-12 27 32 61C76 27 54-4 32 17Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
        />
        <path
          d="M32 14 21 3M32 14 43 3"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="25" cy="29" r="5" fill="currentColor" />
        <path
          d="M29 31c7-7 15-2 13 5-2 5-9 7-13 3l-8-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path d="m30 43 7 6-7 6-6-6Z" fill="currentColor" />
      </svg>
      <span>
        <strong>Enroll Baby</strong>
        <small>Un avenir en bonne santé</small>
      </span>
    </Link>
  );
}
