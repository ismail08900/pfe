export default function Checkbox({ checked, ...props }) {
  return (
    <span className="relative inline-flex items-center">
      <input
        type="checkbox"
        checked={checked}
        className="peer sr-only"
        {...props}
      />
      <span
        className={`
        w-5 h-5 rounded border border-green-600 bg-white flex items-center justify-center
        peer-focus:ring-2 peer-focus:ring-green-200 transition
      `}
      >
        {checked && (
          <svg
            className="w-4 h-4 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </span>
    </span>
  );
}