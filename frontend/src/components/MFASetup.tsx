// frontend/src/components/MFASetup.tsx
/**
 * MFA Setup / Explanation Screen
 *
 * This is a UX-focused component that explains how MFA fits
 * into your Cognito setup and what a student would experience.
 *
 * Actual MFA enforcement (SMS / TOTP) is configured directly
 * on the Cognito User Pool (MFA settings + policies). The
 * custom login and hosted UI will then automatically enforce
 * those challenges.
 */

export default function MFASetup() {
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
        <h1>🔐 Multi‑Factor Authentication (MFA)</h1>
        <p style={{ marginTop: 8, color: "#4b5563" }}>
          WiseUni can require an additional factor (SMS or authenticator app)
          when students log in, powered entirely by AWS Cognito.
        </p>

        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: "1.05rem" }}>How it fits into this project</h2>
          <ul style={{ marginTop: 8, paddingLeft: "1.2rem", color: "#4b5563" }}>
            <li>
              Hosted UI: MFA prompts are handled by Cognito’s hosted pages
              automatically after username/password.
            </li>
            <li>
              Custom auth: When MFA is enabled, Cognito returns an MFA
              challenge, which the custom login flow can respond to.
            </li>
            <li>
              Tokens: After successful MFA, the same ID/Access/Refresh tokens
              are issued and stored in <code>localStorage</code>.
            </li>
          </ul>
        </div>

        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: "1.05rem" }}>Typical student experience</h2>
          <ol style={{ marginTop: 8, paddingLeft: "1.2rem", color: "#4b5563" }}>
            <li>Enter email + password.</li>
            <li>Receive a one-time code via SMS or authenticator app.</li>
            <li>Enter the code and complete login.</li>
          </ol>
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
          In a production build, this screen would also expose per‑user toggles
          (enable/disable TOTP), QR code enrollment, and backup codes, backed by
          Cognito’s MFA APIs.
        </div>
      </div>
    </div>
  );
}

