"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSection } from "../i18n/context";

// ── Types ─────────────────────────────────────────────────────────────────────

type Sender = "bot" | "user";
type QuickReply = { label: string; flow: FlowId };
type ExternalLink = { label: string; href: string; external?: boolean };
type Message = {
  id: string;
  sender: Sender;
  body: string;
  links?: ExternalLink[];
};
type FlowId =
  | "welcome" | "driver" | "negotiation" | "locations"
  | "payments" | "complaint" | "human" | "ride-issue" | "no-match";
type Flow = {
  reply: (string | { body: string; links?: ExternalLink[] })[];
  next: QuickReply[];
};

// ── Flows ─────────────────────────────────────────────────────────────────────

/* Flow copy now lives in i18n (chatbot.flows) so it follows the picked
   language. Shape is unchanged — see Flow / QuickReply above. */

// ── Keyword matcher ───────────────────────────────────────────────────────────

function matchFlow(input: string): FlowId {
  const t = input.toLowerCase();
  const has = (...w: string[]) => w.some((x) => t.includes(x));
  if (has("driver", "drive", "apply", "join", "onboard")) return "driver";
  if (has("negotiat", "fare", "price", "haggle", "offer")) return "negotiation";
  if (has("where", "location", "area", "kigali", "musanze")) return "locations";
  if (has("pay", "momo", "airtel", "cash", "wallet", "payout")) return "payments";
  if (has("complain", "refund", "overcharge", "wrong", "bad")) return "complaint";
  if (has("ride", "trip", "issue", "problem", "dispute")) return "ride-issue";
  if (has("human", "person", "agent", "support", "call", "whatsapp")) return "human";
  return "no-match";
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = "rides-chatbot-history";
const makeId = () => `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function flowToMessages(flow: Flow): Message[] {
  return flow.reply.map((r) =>
    typeof r === "string"
      ? { id: makeId(), sender: "bot" as Sender, body: r }
      : { id: makeId(), sender: "bot" as Sender, body: r.body, links: r.links },
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Chatbot() {
  const cb = useSection("chatbot");
  const FLOWS = cb.flows as unknown as Record<FlowId, Flow>;
  const [open, setOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>(FLOWS.welcome.next);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Restore / seed history
  useEffect(() => {
    setMounted(true);
    setTimeout(() => setMessages(flowToMessages(FLOWS.welcome)), 200);
  }, []);

  useEffect(() => {
    if (!mounted || messages.length === 0) return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages, mounted]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => {
    if (!open && messages.length > 0 && messages[messages.length - 1].sender === "bot") {
      setHasNew(true);
    }
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  function runFlow(flowId: FlowId) {
    const flow = FLOWS[flowId];
    setQuickReplies([]);
    setTyping(true);
    const replies = flowToMessages(flow);
    replies.forEach((msg, i) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, msg]);
        if (i === replies.length - 1) {
          setTyping(false);
          setQuickReplies(flow.next);
        }
      }, 500 + i * 700);
    });
  }

  function handleQuickReply(reply: QuickReply) {
    setMessages((prev) => [...prev, { id: makeId(), sender: "user", body: reply.label }]);
    runFlow(reply.flow);
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    setMessages((prev) => [...prev, { id: makeId(), sender: "user", body: value }]);
    setInput("");
    runFlow(matchFlow(value));
  }

  function resetChat() {
    setMessages(flowToMessages(FLOWS.welcome));
    setQuickReplies(FLOWS.welcome.next);
    window.sessionStorage.removeItem(STORAGE_KEY);
  }

  const unread = useMemo(() => !open && hasNew, [open, hasNew]);

  return (
    <>
      {/* ── Floating bubble ─────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => { setOpen((v) => !v); setHasNew(false); }}
        aria-label={open ? cb.closeLabel : cb.openLabel}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-primary-strong text-primary-foreground shadow-2xl shadow-primary/40 transition-all duration-300 hover:scale-[1.05] active:scale-[0.95]"
      >
        {/* Close icon */}
        <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${open ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>

        {/* Open icon — logo + label */}
        <span className={`absolute inset-0 flex flex-col items-center justify-center gap-0.5 transition-all duration-300 ${open ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}>
          <img src="/ridelogo.png" alt="" className="h-8 w-8 object-contain brightness-0 invert" aria-hidden />
          <span className="text-[10px] font-black tracking-wide text-emerald-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">Chat</span>
        </span>


      </button>

      {/* ── Chat panel ──────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-label={cb.chatLabel}
        aria-hidden={!open}
        className={`fixed bottom-24 z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/20 transition-all duration-300 ease-out inset-x-4 sm:inset-x-auto sm:right-6 sm:w-80 ${
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-95 opacity-0"
        }`}
        style={{ height: "32rem" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 bg-primary px-4 py-3">
          <img src="/ridelogo.png" alt="Rides" className="h-8 w-8 shrink-0 object-contain brightness-0 invert" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white leading-none">{cb.assistantName}</p>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="relative flex-1 space-y-3 overflow-y-auto px-4 py-4"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Wallpaper */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              backgroundImage: "url('/ridelogo.png')",
              backgroundSize: "150px",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.06,
            }}
          />
          <div className="relative z-10 space-y-3">
            {messages.map((m) => (
              <ChatBubble key={m.id} message={m} onClose={() => setOpen(false)} />
            ))}
            {typing && <TypingBubble />}
          </div>
        </div>



        {/* Input */}
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 border-t border-border bg-card px-3 py-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={cb.inputPlaceholder}
            className="h-11 flex-1 rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/30 transition-transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}

// ── Chat bubble ───────────────────────────────────────────────────────────────

function ChatBubble({ message, onClose }: { message: Message; onClose: () => void }) {
  const isUser = message.sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-primary text-white"
            : "rounded-bl-sm bg-card text-foreground ring-1 ring-border"
        }`}
      >
        {message.body && (
          <p className="whitespace-pre-wrap">{message.body}</p>
        )}
        {message.links && message.links.length > 0 && (
          <div className={`${message.body ? "mt-2" : ""} flex flex-wrap gap-1.5`}>
            {message.links.map((l) =>
              l.external ? (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  {l.label}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5" aria-hidden>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              ) : (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={onClose}
                  className="inline-flex items-center rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  {l.label}
                </Link>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Typing indicator ──────────────────────────────────────────────────────────

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-card px-3 py-2.5 ring-1 ring-border">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-zinc-400"
            style={{ animation: `chatbot-typing 1.2s ease-in-out ${i * 0.15}s infinite` }}
          />
        ))}
      </div>
      <style>{`
        @keyframes chatbot-typing {
          0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
}
