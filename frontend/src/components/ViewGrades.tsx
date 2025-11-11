// frontend/src/components/ViewGrades.tsx
/**
 * View Grades Component
 * Fetches grades from DynamoDB
 */

// ✅ IMPORTANT: Must be 'export default'
export default function ViewGrades() {
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
        <h1>📊 View Grades</h1>
        <p>See your grades from DynamoDB</p>
        
        <div style={{ marginTop: '20px' }}>
          <p>Coming soon in Part 2!</p>
        </div>
      </div>
    </div>
  );
}