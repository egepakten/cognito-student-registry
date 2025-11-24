export default function Card(props: {
  title: string;
  children: React.ReactNode;
}) {
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
