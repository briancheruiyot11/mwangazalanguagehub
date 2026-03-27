export default function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  className = "",
  light = false,
}) {
  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`mb-2 block text-sm font-medium ${
            light ? "text-white" : "text-gray-900"
          }`}
        >
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg px-3 py-2.5 text-sm outline-none transition ${
          light
            ? "border border-white/10 bg-white/5 text-white placeholder:text-white/45 focus:border-white/20"
            : "border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-black"
        }`}
      />
    </div>
  );
}