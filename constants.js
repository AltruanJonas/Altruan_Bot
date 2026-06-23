import React, { useState, useEffect, useRef, useCallback } from "react";
import { C, TEAMS_PURPLE, now, uid } from "../constants";
import { useBotEngine } from "../hooks/useBotEngine";
import { Avatar, AdaptiveCard, TypingIndicator } from "./ui";
import { EANForm, AddressForm } from "./Forms";

export default function ChatView({ currentUser, allUsers, isAdmin }) {
  const [messages, setMessages]       = useState({});
  const [typing, setTyping]           = useState(false);
  const [input, setInput]             = useState("");
  const [activeChatUser, setActiveChatUser] = useState(allUsers.find(u => !u.isAdmin) || allUsers[0]);
  const [syncState, setSyncState]     = useState({ running: false, remaining: 600, attempts: 0, maxAttempts: 2 });
  const syncRef  = useRef(null);
  const bottomRef = useRef(null);

  const getMessages = useCallback((userId) => messages[userId] || [], [messages]);

  const addMessageForUser = useCallback((msg, userId) => {
    setMessages(prev => ({ ...prev, [userId]: [...(prev[userId] || []), msg] }));
  }, []);

  const addMsgCurrent = useCallback((msg) => {
    const userId = isAdmin ? activeChatUser?.id : currentUser.id;
    addMessageForUser(msg, userId);
  }, [isAdmin, activeChatUser, currentUser, addMessageForUser]);

  const { handleInput, pendingFormRef } = useBotEngine(addMsgCurrent, setTyping, syncState, setSyncState);

  // Sync-Timer
  useEffect(() => {
    if (!syncState.running) return;
    if (syncRef.current) clearInterval(syncRef.current);
    syncRef.current = setInterval(() => {
      setSyncState(prev => {
        if (prev.remaining <= 1) {
          clearInterval(syncRef.current);
          const userId = isAdmin ? activeChatUser?.id : currentUser.id;
          const att = prev.attempts + 1;
          setTimeout(() => {
            if (att >= prev.maxAttempts) {
              addMessageForUser({ id: uid(), from: "bot", time: now(), card: {
                color: C.red, icon: "❌", title: "Sync 2× fehlgeschlagen – Jira erstellt",
                rows: [["Ticket","TK-2045","red"],["Priorität","Hoch","red"],["Zugewiesen","DevOps-Team",""],["Status","Offen","amber"]],
              }}, userId);
              addMessageForUser({ id: uid(), from: "bot", time: now(), text: "Nach 2 Fehlversuchen wurde Jira-Ticket TK-2045 automatisch erstellt und dem DevOps-Team zugewiesen." }, userId);
            } else {
              addMessageForUser({ id: uid(), from: "bot", time: now(), card: {
                color: C.green, icon: "✅", title: "Sync erfolgreich",
                rows: [["Datensätze","47 / 47","green"],["Dauer","11 Sekunden",""],["Fehler","0","green"],["Nächster Sync","In 10 Minuten",""]],
              }}, userId);
              addMessageForUser({ id: uid(), from: "bot", time: now(), text: "Sync erfolgreich. Alle 47 Datensätze übertragen." }, userId);
            }
          }, 600);
          return { ...prev, running: false, remaining: 600, attempts: att };
        }
        return { ...prev, remaining: prev.remaining - 1 };
      });
    }, 1000);
    return () => clearInterval(syncRef.current);
  }, [syncState.running, addMessageForUser, isAdmin, activeChatUser, currentUser]);

  // Scroll to bottom
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing, activeChatUser]);

  // Begrüßung
  useEffect(() => {
    const userId = currentUser.id;
    if (!messages[userId] || messages[userId].length === 0) {
      setTimeout(() => {
        addMessageForUser({
          id: uid(), from: "bot", time: now(),
          text: `Hallo ${currentUser.name.split(" ")[0]}! Ich bin der Altruan Assistent. Wie kann ich dir helfen?`,
        }, userId);
      }, 500);
    }
  }, [currentUser.id]); // eslint-disable-line

  async function send() {
    const text = input.trim();
    if (!text || typing) return;
    setInput("");
    const userId = isAdmin ? activeChatUser?.id : currentUser.id;
    const history = getMessages(userId);
    addMessageForUser({ id: uid(), from: "user", text, time: now(), userId: currentUser.id }, userId);
    await handleInput(text, history);
  }

  function handleEANSubmit(e1, e2) {
    const userId = isAdmin ? activeChatUser?.id : currentUser.id;
    addMessageForUser({ id: uid(), from: "user", time: now(), text: `EAN WC-00441: ${e1}  ·  WC-00519: ${e2}`, userId: currentUser.id }, userId);
    setMessages(prev => ({ ...prev, [userId]: (prev[userId] || []).filter(m => !m.form) }));
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      addMessageForUser({ id: uid(), from: "bot", time: now(), card: {
        color: C.green, icon: "✅", title: "Stammdaten aktualisiert – Sync erfolgreich",
        rows: [["Artikel 1 EAN", e1, "green"], ["Artikel 2 EAN", e2, "green"], ["Weclapp", "Aktualisiert", "green"], ["Pulpo Transfer", "12 / 12 Positionen", "green"], ["Lieferschein P91111", "Verfügbar", "green"]],
      }}, userId);
      addMessageForUser({ id: uid(), from: "bot", time: now(), text: "EAN gespeichert und Sync sofort ausgeführt. Bestellung P91111 vollständig in Pulpo übertragen." }, userId);
    }, 1800);
  }

  function handleEANCancel(act) {
    const userId = isAdmin ? activeChatUser?.id : currentUser.id;
    setMessages(prev => ({ ...prev, [userId]: (prev[userId] || []).filter(m => !m.form) }));
    if (act === "jira") {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        addMessageForUser({ id: uid(), from: "bot", time: now(), card: {
          color: C.red, icon: "🎫", title: "Jira TK-2044 – Fehlende EAN P91111",
          rows: [["Ticket","TK-2044","red"],["Priorität","Mittel","amber"],["Zugewiesen","Stammdaten-Team",""],["P91111","Blockiert bis Lösung","amber"]],
        }}, userId);
        addMessageForUser({ id: uid(), from: "bot", time: now(), text: "Ticket TK-2044 erstellt. Du bekommst eine Meldung sobald die EAN gepflegt wurde." }, userId);
      }, 1400);
    } else {
      addMessageForUser({ id: uid(), from: "bot", time: now(), text: "Abgebrochen. Schreib mir wenn du weitere Hilfe benötigst." }, userId);
    }
  }

  function handleAddrSubmit(addr) {
    const userId = isAdmin ? activeChatUser?.id : currentUser.id;
    addMessageForUser({ id: uid(), from: "user", time: now(), text: `${addr.name}, ${addr.street}, ${addr.plz} ${addr.city}, ${addr.land}`, userId: currentUser.id }, userId);
    setMessages(prev => ({ ...prev, [userId]: (prev[userId] || []).filter(m => !m.form) }));
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      addMessageForUser({ id: uid(), from: "bot", time: now(), card: {
        color: C.green, icon: "✅", title: "Adresse gespeichert & Carrier informiert",
        rows: [["Empfänger", addr.name, "green"], ["PLZ / Stadt", `${addr.plz} ${addr.city}`, "green"], ["Weclapp", "Aktualisiert", "green"], ["Pulpo", "Aktualisiert", "green"], ["DHL", "Informiert – Zustellung heute", "green"]],
      }}, userId);
      addMessageForUser({ id: uid(), from: "bot", time: now(), text: "Adresse korrigiert. DHL wurde automatisch über die Änderung informiert." }, userId);
    }, 1800);
  }

  const displayUser = isAdmin ? activeChatUser : currentUser;
  const chatMessages = getMessages(displayUser?.id);
  const syncMin = Math.floor(syncState.remaining / 60);
  const syncSec = String(syncState.remaining % 60).padStart(2, "0");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Sync-Bar */}
      {syncState.running && (
        <div style={{ background: "#E6F1FB", borderBottom: "0.5px solid #B5D4F4", padding: "5px 14px", fontSize: 11, color: "#0C447C", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>🔄 Nächster Sync in <strong>{syncMin}:{syncSec}</strong></span>
          <div style={{ width: 80, height: 3, background: "#B5D4F4", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${Math.round((600 - syncState.remaining) / 600 * 100)}%`, height: "100%", background: "#185FA5", transition: "width 1s linear" }} />
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ padding: "10px 14px", borderBottom: "0.5px solid #e8e8e5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar init="AA" bg="#EEEDFE" tc="#534AB7" size={36} online />
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Altruan Assistent</div>
            <div style={{ fontSize: 11, color: "#888", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#639922", display: "inline-block" }} />
              Online · KI-Assistent
              {isAdmin && activeChatUser && <span style={{ marginLeft: 6, color: "#534AB7" }}>→ {activeChatUser.name}</span>}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {isAdmin && (
            <select
              onChange={e => { const u = allUsers.find(u => u.id === parseInt(e.target.value)); if (u) setActiveChatUser(u); }}
              value={activeChatUser?.id}
              style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, border: "0.5px solid #ccc", background: "white" }}
            >
              {allUsers.filter(u => !u.isAdmin).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          )}
          <span style={{ fontSize: 11, background: "#EAF3DE", color: "#3B6D11", padding: "3px 9px", borderRadius: 4 }}>🔒 Privat</span>
          {isAdmin && <span style={{ fontSize: 11, background: "#FAEEDA", color: "#854F0B", padding: "3px 9px", borderRadius: 4 }}>👁 Admin</span>}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ textAlign: "center", fontSize: 10, color: "#aaa", padding: "2px 0" }}>
          {new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}
        </div>

        {chatMessages.map(msg => {
          const isMe = msg.from === "user";
          const msgUser = isMe ? (allUsers.find(u => u.id === msg.userId) || currentUser) : null;

          if (msg.form === "ean") return (
            <div key={msg.id} style={{ display: "flex", gap: 8 }}>
              <Avatar init="AA" bg="#EEEDFE" tc="#534AB7" size={28} />
              <EANForm onSubmit={handleEANSubmit} onCancel={handleEANCancel} />
            </div>
          );

          if (msg.form === "address") return (
            <div key={msg.id} style={{ display: "flex", gap: 8 }}>
              <Avatar init="AA" bg="#EEEDFE" tc="#534AB7" size={28} />
              <AddressForm onSubmit={handleAddrSubmit} onCancel={() => {
                const userId = isAdmin ? activeChatUser?.id : currentUser.id;
                setMessages(prev => ({ ...prev, [userId]: (prev[userId] || []).filter(m => !m.form) }));
                addMessageForUser({ id: uid(), from: "bot", time: now(), text: "Abgebrochen." }, userId);
              }} />
            </div>
          );

          return (
            <div key={msg.id} style={{ display: "flex", gap: 8, alignItems: "flex-end", flexDirection: isMe ? "row-reverse" : "row" }}>
              {isMe
                ? <Avatar init={msgUser?.init || "?"} bg={msgUser?.bg || "#eee"} tc={msgUser?.tc || "#333"} size={28} />
                : <Avatar init="AA" bg="#EEEDFE" tc="#534AB7" size={28} />
              }
              <div style={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: "80%", alignItems: isMe ? "flex-end" : "flex-start" }}>
                {msg.card
                  ? <AdaptiveCard card={msg.card} />
                  : (
                    <div style={{
                      borderRadius: 11, padding: "9px 13px", fontSize: 13, lineHeight: 1.5,
                      ...(isMe
                        ? { background: TEAMS_PURPLE, color: "white", borderBottomRightRadius: 3 }
                        : { background: "#f1f0eb", border: "0.5px solid #e0dfd8", borderBottomLeftRadius: 3, color: "#222" }
                      ),
                    }}>{msg.text}</div>
                  )
                }
                <div style={{ fontSize: 10, color: "#aaa", padding: "0 3px" }}>{msg.time}</div>
              </div>
            </div>
          );
        })}

        {typing && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "10px 14px", borderTop: "0.5px solid #eee", display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Nachricht schreiben..."
          style={{ flex: 1, padding: "8px 14px", borderRadius: 18, border: "0.5px solid #ccc", fontSize: 13, fontFamily: "inherit", outline: "none", background: "#f8f8f7" }}
        />
        <button
          onClick={send}
          style={{ width: 34, height: 34, borderRadius: "50%", background: TEAMS_PURPLE, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "white" }}
        >➤</button>
      </div>
    </div>
  );
}
