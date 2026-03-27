import Card from "./Card";

export default function LessonCard({ lesson, onComplete }) {
  return (
    <Card>
      <h3 className="text-lg font-semibold">{lesson.title}</h3>
      <p className="mt-1 text-sm text-gray-500">{lesson.content_type}</p>

      <div className="mt-3 text-sm text-gray-700">
        {lesson.content_type === "video" ? (
          <a
            href={lesson.content}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            Open Video
          </a>
        ) : (
          <p>{lesson.content}</p>
        )}
      </div>

      {onComplete && (
        <button
          onClick={() => onComplete(lesson.id)}
          className="mt-4 rounded bg-black px-4 py-2 text-sm text-white"
        >
          Mark Complete
        </button>
      )}
    </Card>
  );
}