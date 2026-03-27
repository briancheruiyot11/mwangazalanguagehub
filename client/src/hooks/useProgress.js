"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function useProgress(courseId) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    apiRequest(`/progress/course/${courseId}`)
      .then(setProgress)
      .finally(() => setLoading(false));
  }, [courseId]);

  return { progress, loading, setProgress };
}