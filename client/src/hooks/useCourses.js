"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function useCourses(endpoint = "/courses") {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest(endpoint)
      .then(setCourses)
      .finally(() => setLoading(false));
  }, [endpoint]);

  return { courses, loading, setCourses };
}