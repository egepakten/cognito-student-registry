/* ---------- Student view ---------- */

import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { UserProfile } from "../../services/dynamoDBService";
import { Enrollment } from "../../services/dynamoDBService";
import { Grade } from "../../services/dynamoDBService";
import {
  getUserProfile,
  getMyEnrollments,
  getMyGrades,
} from "../../services/dynamoDBService";
import Card from "../../utils/Card";

export default function StudentDashboard() {
  const { user, tokens } = useAuth();

  // CHANGE: Added state for real data from DynamoDB
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [error, setError] = useState<string | null>(null);

  // CHANGE: Fetch user data on mount
  // REASON: Data is fetched with user's credentials, enforcing isolation
  useEffect(() => {
    async function fetchData() {
      if (!tokens?.idToken) return;

      try {
        setLoading(true);

        // Parallel fetch for better performance
        const [profileData, enrollmentData, gradeData] = await Promise.all([
          getUserProfile(tokens.idToken),
          getMyEnrollments(tokens.idToken),
          getMyGrades(tokens.idToken),
        ]);

        setProfile(profileData);
        setEnrollments(enrollmentData);
        setGrades(gradeData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load your data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tokens?.idToken]);
  // CHANGE: Merge grades into enrollments for display
  const coursesWithGrades = enrollments.map((enrollment) => {
    const gradeRecord = grades.find((g) => g.courseId === enrollment.courseId);
    return {
      ...enrollment,
      grade: gradeRecord?.grade || "—",
    };
  });

  // Calculate GPA from grades
  const calculateGPA = (): string => {
    const gradePoints: Record<string, number> = {
      "A+": 4.0,
      A: 4.0,
      "A-": 3.7,
      "B+": 3.3,
      B: 3.0,
      "B-": 2.7,
      "C+": 2.3,
      C: 2.0,
      "C-": 1.7,
      "D+": 1.3,
      D: 1.0,
      "D-": 0.7,
      F: 0.0,
    };

    const validGrades = grades.filter(
      (g) => gradePoints[g.grade] !== undefined
    );
    if (validGrades.length === 0) return "N/A";

    const total = validGrades.reduce(
      (sum, g) => sum + (gradePoints[g.grade] || 0),
      0
    );
    return (total / validGrades.length).toFixed(2);
  };
  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading your data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "#ef4444", textAlign: "center" }}>
        {error}
      </div>
    );
  }
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}
    >
      <Card title="📚 My Enrolled Courses">
        {coursesWithGrades.length === 0 ? (
          <p style={{ color: "#6b7280" }}>
            You are not enrolled in any courses yet.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            {coursesWithGrades.map((course) => (
              <div
                key={course.courseId}
                style={{
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                  padding: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                    {course.courseName}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      padding: "2px 8px",
                      borderRadius: "999px",
                      background: "#eef2ff",
                      color: "#4f46e5",
                    }}
                  >
                    {course.courseId}
                  </span>
                </div>
                <p style={{ margin: "4px 0", fontSize: "0.85rem" }}>
                  {course.professorName}
                </p>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>
                  Grade: <strong>{course.grade}</strong>
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Card title="📊 My Academic Summary">
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: "0.9rem",
              color: "#4b5563",
            }}
          >
            <li>GPA: {calculateGPA()}</li>
            <li>Courses Enrolled: {enrollments.length}</li>
            <li>Grades Received: {grades.length}</li>
            {profile?.createdAt && (
              <li>
                Member Since: {new Date(profile.createdAt).toLocaleDateString()}
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
