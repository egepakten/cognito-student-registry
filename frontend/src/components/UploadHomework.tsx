// frontend/src/components/UploadHomework.tsx
/**
 * Homework Upload Component
 * Uploads files to S3 using temporary credentials
 */

// ✅ IMPORTANT: Must be 'export default'
export default function UploadHomework() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
      }}>
        <h1>📚 Upload Homework</h1>
        <p>Upload your homework files to S3</p>
        
        <div style={{ marginTop: '20px' }}>
          <p>Coming soon in Part 2!</p>
        </div>
      </div>
    </div>
  );
}