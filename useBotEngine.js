import React from "react";

export function Avatar({ init, bg, tc, size = 32, online = false }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: bg, color: tc,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: Math.round(size * 0.35), fontWeight: 500,
      }}>{init}</div>
      {online && (
        <div style={{
          width: 10, height: 10, borderRadius: "50%", background: "#639922",
          position: "absolute", bottom: 0, right: 0,
          border: "2px solid white",
        }} />
      )}
    </div>
  );
}

export function Pill({ children, color, small }) {
  return (
    <span style={{
      fontSize: small ? 10 : 11, padding: small ? "2px 6px" : "3px 9px",
      borderRadius: 4, background: color.bg, color: color.text,
      fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4,
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

export function Btn({ children, primary, danger, warn, onClick, small, disabled, style: extra }) {
  const bg  = primary ? "#534AB7" : "transparent";
  const col = primary ? "#EEEDFE" : danger ? "#A32D2D" : warn ? "#854F0B" : "#444";
  const bdr = primary ? "#534AB7" : danger ? "#E24B4A" : warn ? "#EF9F27" : "#ccc";
  return (
    <button onClick={onClick} disabled={disabled} style={{
      fontSize: small ? 11 : 12, padding: small ? "4px 10px" : "6px 13px",
      borderRadius: 7, border: `0.5px solid ${bdr}`,
      background: bg, color: col, cursor: disabled ? "default" : "pointer",
      opacity: disabled ? 0.5 : 1,
      display: "inline-flex", alignItems: "center", gap: 5,
      fontFamily: "inherit", fontWeight: 400, ...extra,
    }}>{children}</button>
  );
}

export function AdaptiveCard({ card }) {
  return (
    <div style={{
      borderRadius: 11, overflow: "hidden",
      border: `0.5px solid ${card.color.border}`,
      borderLeft: `3px solid ${card.color.strong}`,
      maxWidth: "88%", background: "white",
    }}>
      <div style={{ padding: "9px 13px", background: card.color.bg, color: card.color.text, fontSize: 12, fontWeight: 500 }}>
        {card.icon} {card.title}
      </div>
      <div style={{ background: "#f8f8f7", padding: "8px 13px" }}>
        {card.rows.map((r, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", fontSize: 11,
            padding: "4px 0", borderBottom: i < card.rows.length - 1 ? "0.5px solid #e8e8e5" : "none",
          }}>
            <span style={{ color: "#888" }}>{r[0]}</span>
            <span style={{
              fontWeight: 500,
              color: r[2] === "red" ? "#A32D2D" : r[2] === "green" ? "#3B6D11" : r[2] === "amber" ? "#854F0B" : "#333",
            }}>{r[1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <>
      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}`}</style>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <Avatar init="AA" bg="#EEEDFE" tc="#534AB7" size={28} />
        <div style={{ background: "#f1f0eb", border: "0.5px solid #e0dfd8", borderRadius: 11, borderBottomLeftRadius: 3, padding: "10px 14px", display: "flex", gap: 4 }}>
          {[0, 150, 300].map(d => (
            <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: "#aaa", animation: "bounce 0.9s infinite", animationDelay: `${d}ms` }} />
          ))}
        </div>
      </div>
    </>
  );
}
