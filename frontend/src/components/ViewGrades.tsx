// frontend/src/components/ViewGrades.tsx
/**
 * View Grades Component
 *
 * Uses the `useDynamoDB` hook to fetch the student's grades.
 * For now it falls back to demo data if the API is not present.
 */

import { useDynamoDB } from "../hooks/useDynamoDB";

// ✅ IMPORTANT: Must be 'export default'
export default function ViewGrades() {
  const { grades, loading, error, refresh } = useDynamoDB();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          borderRadius: "12px",
          padding: "30px",
        }}
      >
        <h1>📊 View Grades</h1>
        <p style={{ color: "#4b5563" }}>
          These records would typically be stored in DynamoDB and filtered by
          the authenticated student.
        </p>

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          style={{
            marginTop: "16px",
            padding: "8px 14px",
            borderRadius: "999px",
            border: "none",
            background: "#4f46e5",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "0.9rem",
          }}
        >
          {loading ? "Refreshing..." : "Refresh Grades"}
        </button>

        {error && (
          <div
            style={{
              marginTop: "16px",
              padding: "10px 12px",
              borderRadius: "8px",
              background: "#fffbeb",
              color: "#92400e",
              fontSize: "0.9rem",
            }}
          >
            ⚠️ {error} — showing demo data instead.
          </div>
        )}

        <div style={{ marginTop: "24px" }}>
          {loading && grades.length === 0 ? (
            <p>Loading grades...</p>
          ) : grades.length === 0 ? (
            <p>No grades available yet.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "16px",
              }}
            >
              {grades.map((grade) => (
                <div
                  key={grade.id}
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    padding: "16px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: 6,
                    }}
                  >
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "1rem",
                      }}
                    >
                      {grade.courseName}
                    </h2>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        background: "#eef2ff",
                        color: "#4f46e5",
                      }}
                    >
                      {grade.courseCode}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: "4px 0 8px",
                      fontSize: "0.9rem",
                      color: "#6b7280",
                    }}
                  >
                    {grade.assignment}
                  </p>

                  <p style={{ margin: 0, fontWeight: 500 }}>
                    {grade.score} / {grade.total}
                  </p>

                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.8rem",
                      color: "#9ca3af",
                    }}
                  >
                    <span>Updated: {grade.updatedAt}</span>
                    <span>{grade.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
