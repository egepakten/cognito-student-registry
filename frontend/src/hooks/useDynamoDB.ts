// frontend/src/hooks/useDynamoDB.ts
/**
 * DynamoDB Hook (Grades)
 *
 * This encapsulates the "View Grades" data flow.
 * In a real app, this would call a backend API that talks
 * to DynamoDB using the student's JWT/role for auth.
 *
 * For now:
 * - Tries to call `/api/grades` with the access token
 * - Falls back to demo data if the request fails
 */

import { useEffect, useState, useCallback } from "react";

export interface GradeRecord {
  id: string;
  courseCode: string;
  courseName: string;
  assignment: string;
  score: number;
  total: number;
  status: "Passed" | "Pending" | "Flagged";
  updatedAt: string;
}

interface UseDynamoDBResult {
  grades: GradeRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useDynamoDB(): UseDynamoDBResult {
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGrades = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch("/api/grades", {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch grades (status ${response.status})`);
      }

      const data = (await response.json()) as GradeRecord[];
      setGrades(data);
    } catch (err) {
      console.warn("Falling back to demo grades data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load grades from API"
      );

      // Demo data so the UI still looks complete
      setGrades([
        {
          id: "1",
          courseCode: "CS101",
          courseName: "Intro to Computer Science",
          assignment: "Homework 1",
          score: 92,
          total: 100,
          status: "Passed",
          updatedAt: "2025-11-20",
        },
        {
          id: "2",
          courseCode: "MATH204",
          courseName: "Discrete Mathematics",
          assignment: "Midterm Exam",
          score: 78,
          total: 100,
          status: "Pending",
          updatedAt: "2025-11-18",
        },
        {
          id: "3",
          courseCode: "HIST210",
          courseName: "Modern European History",
          assignment: "Essay Draft",
          score: 65,
          total: 100,
          status: "Flagged",
          updatedAt: "2025-11-15",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchGrades();
  }, [fetchGrades]);

  return {
    grades,
    loading,
    error,
    refresh: fetchGrades,
  };
}
