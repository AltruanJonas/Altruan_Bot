import React, { useState } from "react";
import { Btn } from "./ui";

export function EANForm({ onSubmit, onCancel }) {
  const [e1, setE1] = useState("");
  const [e2, setE2] = useState("");
  const [err, setErr] = useState("");
  const valid = v => /^\d{8}$|^\d{13}$/.test(v);

  function submit() {
    if (!e1 || !e2 || !valid(e1) || !valid(e2)) {
      setErr("Bitte gültige EAN-8 oder EAN-13 eingeben (8 oder 13 Ziffern).");
      return;
    }
    setErr("");
    onSubmit(e1, e2);
  }

  const inputStyle = {
    width: "100%", padding: "6px 10px", borderRadius: 7,
    border: "0.5px solid #ccc", fontSize: 12,
    fontFamily: "monospace", marginBottom: 8, boxSizing: "border-box",
  };

  return (
    <div style={{ borderRadius: 11, overflow: "hidden", border: "1.5px solid #534AB7", maxWidth: "90%" }}>
      <div style={{ padding: "9px 13px", background: "#EEEDFE", color: "#3C3489", fontSize: 12, fontWeight: 500 }}>
        🔢 Fehlende EAN ergänzen – Bestellung P91111
      </div>
      <div style={{ padding: 13, background: "white" }}>
        <div style={{ padding: "8px 10px", background: "#FAEEDA", borderRadius: 7, borderLeft: "3px solid #EF9F27", marginBottom: 10, fontSize: 11, color: "#633806" }}>
          <strong style={{ color: "#854F0B" }}>2 Artikel ohne EAN gefunden –</strong> Transfer blockiert bis zur Pflege.
        </div>
        <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>Artikel 1 – Schreibtischlampe LED Pro (WC-00441)</div>
        <input value={e1} onChange={e => setE1(e.target.value)} placeholder="EAN-13, z.B. 4006381333931" maxLength={14} style={inputStyle} />
        <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>Artikel 2 – USB-C Hub 7-Port (WC-00519)</div>
        <input value={e2} onChange={e => setE2(e.target.value)} placeholder="EAN-13, z.B. 4006381445021" maxLength={14} style={{ ...inputStyle, marginBottom: err ? 6 : 0 }} />
        {err && <div style={{ fontSize: 11, color: "#A32D2D" }}>{err}</div>}
      </div>
      <div style={{ padding: "8px 13px", background: "#f8f8f7", display: "flex", gap: 6, borderTop: "0.5px solid #eee" }}>
        <Btn primary small onClick={submit}>✓ EAN speichern & Sync starten</Btn>
        <Btn warn small onClick={() => onCancel("jira")}>Jira-Ticket erstellen</Btn>
        <Btn small onClick={() => onCancel("cancel")}>Abbrechen</Btn>
      </div>
    </div>
  );
}

export function AddressForm({ onSubmit, onCancel }) {
  const [f, setF] = useState({ name: "", street: "", plz: "", city: "", land: "Deutschland" });
  const [err, setErr] = useState("");
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  function submit() {
    if (!f.name || !f.street || !f.plz || !f.city) {
      setErr("Bitte alle Pflichtfelder ausfüllen.");
      return;
    }
    setErr("");
    onSubmit(f);
  }

  const inputStyle = {
    width: "100%", padding: "6px 10px", borderRadius: 7,
    border: "0.5px solid #ccc", fontSize: 12, boxSizing: "border-box",
  };

  return (
    <div style={{ borderRadius: 11, overflow: "hidden", border: "1.5px solid #534AB7", maxWidth: "90%" }}>
      <div style={{ padding: "9px 13px", background: "#EEEDFE", color: "#3C3489", fontSize: 12, fontWeight: 500 }}>
        📍 Vollständige Lieferadresse eingeben
      </div>
      <div style={{ padding: 13, background: "white", display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          ["Empfänger / Firma", "name", "z.B. Mustermann GmbH", false],
          ["Straße & Hausnummer", "street", "z.B. Musterstraße 12", false],
        ].map(([label, key, ph]) => (
          <div key={key}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>{label}</div>
            <input value={f[key]} onChange={e => set(key, e.target.value)} placeholder={ph} style={inputStyle} />
          </div>
        ))}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>PLZ</div>
            <input value={f.plz} onChange={e => set("plz", e.target.value)} placeholder="80331" maxLength={5} style={inputStyle} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>Stadt</div>
            <input value={f.city} onChange={e => set("city", e.target.value)} placeholder="München" style={inputStyle} />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>Land</div>
          <input value={f.land} onChange={e => set("land", e.target.value)} placeholder="Deutschland" style={inputStyle} />
        </div>
        {err && <div style={{ fontSize: 11, color: "#A32D2D" }}>{err}</div>}
      </div>
      <div style={{ padding: "8px 13px", background: "#f8f8f7", display: "flex", gap: 6, borderTop: "0.5px solid #eee" }}>
        <Btn primary small onClick={submit}>✓ Adresse bestätigen & speichern</Btn>
        <Btn small onClick={onCancel}>Abbrechen</Btn>
      </div>
    </div>
  );
}
