export default function ContactFormField({
  label,
  required,
  icon,
  error,
  children,
  alignTop = false,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      <div
        className={`flex items-center gap-2 px-3 py-2.5 ${
          alignTop ? "items-start" : "items-center"
        }`}
        style={{
          borderBottom: error
            ? "1px solid red"
            : "1px solid hsla(0, 0%, 83.9%, .5)",
        }}
      >
        <span
          className={`text-gray-400 text-base shrink-0 ${
            alignTop ? "mt-1" : ""
          }`}
        >
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}
