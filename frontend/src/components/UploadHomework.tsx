// frontend/src/components/UploadHomework.tsx
/**
 * Homework Upload Component
 *
 * Uses the `useS3Upload` hook to send homework files to an
 * API that talks to S3 (or directly to a pre-signed URL).
 */

import { useState } from "react";
import { useS3Upload } from "../hooks/useS3Upload";

// ✅ IMPORTANT: Must be 'export default'
export default function UploadHomework() {
  const { uploading, error, successMessage, uploadFile } = useS3Upload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    await uploadFile(selectedFile);
  };

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
          maxWidth: "800px",
          margin: "0 auto",
          background: "white",
          borderRadius: "12px",
          padding: "30px",
        }}
      >
        <h1>📚 Upload Homework</h1>
        <p style={{ color: "#4b5563" }}>
          Select a file and upload it to the homework bucket (via API).
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="homework"
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Homework file
            </label>
            <input
              id="homework"
              type="file"
              onChange={(e) =>
                setSelectedFile(e.target.files ? e.target.files[0] : null)
              }
            />
          </div>

          <button
            type="submit"
            disabled={!selectedFile || uploading}
            style={{
              padding: "10px 18px",
              borderRadius: "999px",
              border: "none",
              background: uploading ? "#9ca3af" : "#4f46e5",
              color: "white",
              cursor: !selectedFile || uploading ? "not-allowed" : "pointer",
            }}
          >
            {uploading ? "Uploading..." : "Upload Homework"}
          </button>
        </form>

        {error && (
          <div
            style={{
              marginTop: "16px",
              padding: "10px 12px",
              borderRadius: "8px",
              background: "#fef2f2",
              color: "#b91c1c",
              fontSize: "0.9rem",
            }}
          >
            ❌ {error}
          </div>
        )}

        {successMessage && (
          <div
            style={{
              marginTop: "16px",
              padding: "10px 12px",
              borderRadius: "8px",
              background: "#ecfdf3",
              color: "#166534",
              fontSize: "0.9rem",
            }}
          >
            ✅ {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}
