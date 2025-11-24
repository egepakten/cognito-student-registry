// frontend/src/components/Dashboard.tsx
/**
 * WiseUni Dashboard
 *
 * Role‑aware dashboard that renders different content for:
 * - Students   (group: "students")
 * - Professors (group: "professors")
 * - Admins     (group: "admins")
 *
 * Role is taken from the Cognito ID token claim "cognito:groups",
 * which you already store in `userInfo` when logging in.
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHostedUIUrls } from "../../config/cognito";
import { useAuth } from "../../hooks/useAuth";
import StudentDashboard from "./StudentDashboard";

type UserRole = "student" | "professor" | "admin" | "unknown";

function resolveRole(groups?: string[]): UserRole {
  if (!groups || groups.length === 0) return "unknown";
  if (groups.includes("admins")) return "admin";
  if (groups.includes("professors")) return "professor";
  if (groups.includes("students")) return "student";
  return "unknown";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, logout } = useAuth();

  // Extra safety in case the route is hit without a valid session
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [loading, isAuthenticated, navigate]);

  const handleLogout = () => {
    // Clear Cognito session + local storage
    logout();

    // Hosted UI logout (ends Cognito cookies / sessions too)
    const hostedUIUrls = getHostedUIUrls();
    window.location.href = hostedUIUrls.logout;
  };

  if (loading || !user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "1.1rem",
        }}
      >
        Loading dashboard...
      </div>
    );
  }

  const role = resolveRole(user["cognito:groups"]);
  const displayName = user.name || user.email;

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
          maxWidth: "1200px",
          margin: "0 auto",
          background: "white",
          borderRadius: "12px",
          padding: "30px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "1.8rem" }}>
              {role === "student" && "🎓 WiseUni Student Dashboard"}
              {role === "professor" && "👨‍🏫 WiseUni Professor Dashboard"}
              {role === "admin" && "🔧 WiseUni Admin Dashboard"}
              {role === "unknown" && "WiseUni Dashboard"}
            </h1>
            <p style={{ marginTop: 4, color: "#4b5563" }}>
              Welcome, {displayName}!
              {user["cognito:groups"] && user["cognito:groups"]!.length > 0 && (
                <span style={{ marginLeft: 8, fontSize: "0.85rem" }}>
                  ({user["cognito:groups"]!.join(", ")})
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              borderRadius: "999px",
              border: "none",
              background: "#111827",
              color: "white",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Logout
          </button>
        </div>

        {/* Quick Links (common to all roles) */}
        <div
          style={{
            padding: "16px 18px",
            borderRadius: "10px",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1rem" }}>Quick Links</h2>
          <div style={{ marginTop: 10, display: "flex", gap: "10px" }}>
            <button
              onClick={() => navigate("/upload")}
              style={{
                padding: "8px 14px",
                borderRadius: "999px",
                border: "none",
                background: "#4f46e5",
                color: "white",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Upload Homework
            </button>
            <button
              onClick={() => navigate("/grades")}
              style={{
                padding: "8px 14px",
                borderRadius: "999px",
                border: "none",
                background: "#111827",
                color: "white",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              View Grades
            </button>
          </div>
        </div>

        {/* Role‑specific dashboard sections */}
        {role === "student" && <StudentDashboard />}
        {role === "professor" && <ProfessorDashboard />}
        {role === "admin" && <AdminDashboard />}
        {role === "unknown" && (
          <p style={{ color: "#6b7280" }}>
            No role found for this account. Please ensure the user belongs to
            one of the Cognito groups: <code>students</code>,{" "}
            <code>professors</code>, or <code>admins</code>.
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- Shared card component ---------- */

function Card(props: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        padding: "18px",
        background: "#ffffff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
      }}
    >
      <h3 style={{ marginTop: 0, fontSize: "1rem" }}>{props.title}</h3>
      <div style={{ marginTop: 8 }}>{props.children}</div>
    </div>
  );
}

/* ---------- Professor view ---------- */

function ProfessorDashboard() {
  const courses = [
    {
      code: "CS101",
      title: "Intro to Computer Science",
      students: 45,
      avgGrade: "B+",
    },
    {
      code: "CS205",
      title: "Data Structures",
      students: 32,
      avgGrade: "B",
    },
  ];

  const activity = [
    "John Doe submitted Assignment 3 in CS101",
    "Jane Smith enrolled in CS101",
    "12 students pending grade review in CS205",
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "16px",
      }}
    >
      <Card title="📖 My Courses">
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {courses.map((course) => (
            <div
              key={course.code}
              style={{
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                padding: "12px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
              >
                {course.code} — {course.title}
              </p>
              <p
                style={{
                  margin: "4px 0 8px",
                  fontSize: "0.85rem",
                  color: "#6b7280",
                }}
              >
                Students: {course.students} · Average Grade: {course.avgGrade}
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  style={{
                    padding: "6px 10px",
                    borderRadius: "999px",
                    border: "none",
                    background: "#4f46e5",
                    color: "white",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  View Roster
                </button>
                <button
                  style={{
                    padding: "6px 10px",
                    borderRadius: "999px",
                    border: "none",
                    background: "#111827",
                    color: "white",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  Manage Grades
                </button>
                <button
                  style={{
                    padding: "6px 10px",
                    borderRadius: "999px",
                    border: "1px solid #d1d5db",
                    background: "white",
                    color: "#374151",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  Course Materials
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Card title="👥 Recent Student Activity">
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: "0.9rem",
              color: "#4b5563",
            }}
          >
            {activity.map((item, idx) => (
              <li
                key={idx}
                style={{
                  padding: "6px 0",
                  borderBottom:
                    idx === activity.length - 1 ? "none" : "1px solid #e5e7eb",
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card title="📝 Quick Actions">
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              style={{
                padding: "6px 10px",
                borderRadius: "999px",
                border: "none",
                background: "#4f46e5",
                color: "white",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              Enter Grades
            </button>
            <button
              style={{
                padding: "6px 10px",
                borderRadius: "999px",
                border: "none",
                background: "#111827",
                color: "white",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              View Reports
            </button>
            <button
              style={{
                padding: "6px 10px",
                borderRadius: "999px",
                border: "1px solid #d1d5db",
                background: "white",
                color: "#374151",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              Send Notice
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Admin view ---------- */

function AdminDashboard() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1.5fr",
        gap: "16px",
      }}
    >
      <Card title="📊 University Overview">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "12px",
          }}
        >
          {[
            { label: "Students", value: "1,234" },
            { label: "Professors", value: "87" },
            { label: "Courses", value: "156" },
            { label: "Active Sessions", value: "312" },
          ].map((metric) => (
            <div
              key={metric.label}
              style={{
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                padding: "12px",
                background: "#f9fafb",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "#6b7280",
                }}
              >
                {metric.label}
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                }}
              >
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="👥 User Management (Preview)">
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            style={{
              padding: "6px 10px",
              borderRadius: "999px",
              border: "none",
              background: "#4f46e5",
              color: "white",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            + Add User
          </button>
          <button
            style={{
              padding: "6px 10px",
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              background: "white",
              color: "#374151",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            Manage Groups
          </button>
          <button
            style={{
              padding: "6px 10px",
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              background: "white",
              color: "#374151",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            Reset Passwords
          </button>
        </div>

        <div
          style={{
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
            fontSize: "0.8rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr",
              padding: "8px 10px",
              background: "#f9fafb",
              fontWeight: 600,
            }}
          >
            <span>ID</span>
            <span>Name</span>
            <span>Role</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {[
            { id: "U001", name: "John Doe", role: "Student", status: "Active" },
            {
              id: "U002",
              name: "Dr. Smith",
              role: "Professor",
              status: "Active",
            },
            {
              id: "U003",
              name: "Jane Doe",
              role: "Student",
              status: "Locked",
            },
          ].map((user, idx) => (
            <div
              key={user.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr",
                padding: "8px 10px",
                background: idx % 2 === 0 ? "white" : "#f9fafb",
              }}
            >
              <span>{user.id}</span>
              <span>{user.name}</span>
              <span>{user.role}</span>
              <span>{user.status}</span>
              <span>
                <button
                  style={{
                    padding: "4px 8px",
                    borderRadius: "999px",
                    border: "1px solid #d1d5db",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
