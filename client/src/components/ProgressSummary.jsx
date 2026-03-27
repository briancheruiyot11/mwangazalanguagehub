import Card from "./Card";
import ProgressBar from "./ProgressBar";

export default function ProgressSummary({ progress }) {
  if (!progress) return null;

  return (
    <Card>
      <h3 className="mb-3 text-lg font-bold">Progress Summary</h3>
      <p className="mb-3">{progress.progress_text}</p>
      <ProgressBar
        completed={progress.completed_lessons}
        total={progress.total_lessons}
      />
    </Card>
  );
}