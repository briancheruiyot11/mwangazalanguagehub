export default function ProgressBar({ completed = 0, total = 0 }) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div>
      <div className="mb-2 flex justify-between text-sm text-gray-600">
        <span>Completed</span>
        <span>
          {completed}/{total}
        </span>
      </div>

      <div className="h-3 w-full rounded-full bg-gray-200">
        <div
          className="h-3 rounded-full bg-black"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}