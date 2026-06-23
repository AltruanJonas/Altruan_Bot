import React, { useState, useEffect } from "react";
import { Btn } from "./ui";

export default function Settings() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("altruan_anthropic_key") || "");
  const [saved, setSaved]   = useState(false);

  function save() {
    localStorage.setItem("altruan_anthropic_key", apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ padding: 24, maxWidth: 560 }}>
      <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Einstellungen</div>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 24 }}>Bot-Konfiguration und API-Zugänge</div>

      {/* Anthropic API Key */}
      <div style={{ background: "white", border: "0.5px solid #e8e8e5", borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Anthropic API-Key</div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 12, lineHeight: 1.5 }}>
          Damit der Altruan Assistent mit echter KI antwortet, wird ein Anthropic API-Key benötigt.
          Den Key bekommst du unter <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ color: "#534AB7" }}>console.anthropic.com</a>.
          Er wird nur lokal in deinem Browser gespeichert und nie an externe Server weitergegeben.
        </div>
        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="sk-ant-..."
          style={{ width: "100%", padding: "8px 12px", borderRadius: 7, border: "0.5px solid #ccc", fontSize: 13, fontFamily: "monospace", boxSizing: "border-box", marginBottom: 10 }}
        />
        <Btn primary onClick={save}>{saved ? "✓ Gespeichert" : "Speichern"}</Btn>
      </div>

      {/* Bot-Info */}
      <div style={{ background: "#f8f8f7", border: "0.5px solid #e8e8e5", borderRadius: 10, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>System-Info</div>
        {[
          ["Version", "1.0.0"],
          ["Modell", "claude-sonnet-4-6"],
          ["Hosting", "GitHub Pages / Vercel"],
          ["Teams-Integration", "Azure Bot Service"],
          ["Sync-Intervall", "10 Minuten (automatisch)"],
          ["Jira-Eskalation", "Nach 2 Fehlversuchen"],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", borderBottom: "0.5px solid #eee" }}>
            <span style={{ color: "#888" }}>{k}</span>
            <span style={{ fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
