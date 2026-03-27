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
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className={`mb-2 block text-sm font-medium ${light ? "text-white" : "text-gray-900"}`}>
          {label}
        </label>
      )}

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl px-4 py-3 outline-none transition ${
          light
            ? "border border-white/15 bg-white/5 text-white placeholder:text-white/45 focus:border-white/30"
            : "border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-black"
        }`}
      />
    </div>
  );
}