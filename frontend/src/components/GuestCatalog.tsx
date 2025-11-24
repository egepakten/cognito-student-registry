// frontend/src/components/GuestCatalog.tsx
/**
 * Guest Catalog
 *
 * Simple, read-only view that shows what a guest can see
 * without being authenticated. This matches the "guest view"
 * mentioned on the home page.
 */

export default function GuestCatalog() {
  const courses = [
    {
      code: "CS101",
      title: "Intro to Computer Science",
      description:
        "Learn fundamental programming concepts and problem solving.",
      level: "Undergraduate",
    },
    {
      code: "MATH204",
      title: "Discrete Mathematics",
      description:
        "Logic, sets, graphs, and combinatorics for computer science.",
      level: "Undergraduate",
    },
    {
      code: "HIST210",
      title: "Modern European History",
      description:
        "From the industrial revolution to the present day in European politics.",
      level: "Undergraduate",
    },
  ];

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
          maxWidth: "1000px",
          margin: "0 auto",
          background: "white",
          borderRadius: "12px",
          padding: "30px",
        }}
      >
        <h1>👀 Guest Course Catalog</h1>
        <p style={{ marginTop: 8, color: "#4b5563" }}>
          Explore a snapshot of WiseUni courses without logging in.
          Authenticated students see their personal dashboard, homework uploads,
          and grades.
        </p>

        <div
          style={{
            marginTop: "24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {courses.map((course) => (
            <div
              key={course.code}
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
                  marginBottom: 8,
                }}
              >
                <h2 style={{ margin: 0, fontSize: "1.1rem" }}>
                  {course.title}
                </h2>
                <span
                  style={{
                    fontSize: "0.85rem",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    background: "#eef2ff",
                    color: "#4f46e5",
                  }}
                >
                  {course.code}
                </span>
              </div>
              <p style={{ margin: "4px 0 8px", color: "#6b7280" }}>
                {course.description}
              </p>
              <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                Level: {course.level}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 24,
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#f9fafb",
            border: "1px dashed #e5e7eb",
            fontSize: "0.9rem",
            color: "#4b5563",
          }}
        >
          Want to see personalised data? Sign up or log in to access the full
          student dashboard, homework uploads, and grades from DynamoDB.
        </div>
      </div>
    </div>
  );
}
