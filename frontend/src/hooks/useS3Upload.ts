// frontend/src/hooks/useS3Upload.ts
/**
 * S3 Upload Hook (Homework)
 *
 * Encapsulates the upload flow for homework files.
 * In a real app, this would typically:
 * - Ask a backend for a pre-signed S3 URL
 * - PUT the file to S3 using that URL
 *
 * For now, we:
 * - POST the file to `/api/upload-homework`
 * - Include the access token for auth (if present)
 */

import { useState } from "react";

interface UseS3UploadResult {
  uploading: boolean;
  error: string | null;
  successMessage: string | null;
  uploadFile: (file: File) => Promise<void>;
}

export function useS3Upload(): UseS3UploadResult {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-homework", {
        method: "POST",
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed (status ${response.status})`);
      }

      setSuccessMessage("Homework uploaded successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload homework"
      );
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    error,
    successMessage,
    uploadFile,
  };
}
