export default function Button({
  children,
  type = "button",
  onClick,
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg bg-black px-4 py-2 text-white transition hover:opacity-90 disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}