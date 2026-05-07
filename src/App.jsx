import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Transactions from "./Transactions";

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );

const formatAmountInput = (raw) => {
  let digits = raw.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  if (!digits) return "";
  if (digits.length === 1) return `0,0${digits}`;
  if (digits.length === 2) return `0,${digits}`;
  return `${digits.slice(0, -2)},${digits.slice(-2)}`;
};

const CONTACTS = [
  { name: "João", initials: "JO" },
  { name: "Jonas", initials: "JN" },
  { name: "Brian", initials: "BR" },
];

const CHART_DATA = [
  { mes: "Out", valor: 320 },
  { mes: "Nov", valor: 480 },
  { mes: "Dez", valor: 700 },
  { mes: "Jan", valor: 890 },
  { mes: "Fev", valor: 560 },
  { mes: "Mar", valor: 430 },
  { mes: "Abr", valor: 610 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#1a1a2e",
          border: "1px solid rgba(99,102,241,0.3)",
          borderRadius: 8,
          padding: "8px 14px",
        }}
      >
        <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#c7d2fe" }}>
          {formatCurrency(payload[0].value)}
        </div>
      </div>
    );
  }
  return null;
};

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState([
    { name: "Netflix", type: "Despesa", value: -50.0, date: "10 Mar 2026" },
    { name: "Salário", type: "Receita", value: 3000.0, date: "08 Mar 2026" },
  ]);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const totalBalance = transactions.reduce((s, t) => s + t.value, 0);
  const totalExpense = Math.abs(
    transactions.filter((t) => t.value < 0).reduce((s, t) => s + t.value, 0),
  );

  const sendMoney = () => {
    if (!recipient || !amount) return;
    const num = parseFloat(amount.replace(",", "."));
    if (num <= 0) return;
    if (num > totalBalance) {
      setErrorMsg("Saldo insuficiente para realizar esta transferência.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    setSending(true);
    setTimeout(() => {
      setTransactions((prev) => [
        {
          name: recipient,
          type: "Transferência",
          value: -num,
          date: new Date().toLocaleDateString("pt-BR"),
        },
        ...prev,
      ]);
      setRecipient("");
      setAmount("");
      setSending(false);
    }, 600);
  };

  const navigate = (p) => {
    setPage(p);
    setMenuOpen(false);
  };

  return (
    <div style={s.root}>
      <style>{css}</style>

      {/* SIDEBAR — desktop */}
      <nav style={s.sidebar} className="sidebar">
        <div style={s.logo}>
          <div style={s.logoMark}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2L18 7V13L10 18L2 13V7L10 2Z"
                fill="white"
                fillOpacity="0.9"
              />
              <path
                d="M10 6L14 8.5V13.5L10 16L6 13.5V8.5L10 6Z"
                fill="white"
                fillOpacity="0.3"
              />
            </svg>
          </div>
          <span style={s.logoText}>Nexus</span>
        </div>
        <div style={s.navGroup}>
          <SideNavItem
            label="Início"
            active={page === "dashboard"}
            onClick={() => navigate("dashboard")}
          />
          <SideNavItem
            label="Transações"
            active={page === "transactions"}
            onClick={() => navigate("transactions")}
          />
        </div>
        <div style={s.sidebarUser}>
          <div style={s.userAvatar}>VC</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#f0f0f0" }}>
              Você
            </div>
            <div style={{ fontSize: 11, color: "#666" }}>conta pessoal</div>
          </div>
        </div>
      </nav>

      {/* TOPBAR — mobile/tablet */}
      <header style={s.topbar} className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={s.logoMark}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2L18 7V13L10 18L2 13V7L10 2Z"
                fill="white"
                fillOpacity="0.9"
              />
            </svg>
          </div>
          <span style={s.logoText}>Nexus</span>
        </div>
        <button
          style={s.menuBtn}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
        >
          <span
            style={{
              ...s.hbar,
              transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none",
            }}
          />
          <span style={{ ...s.hbar, opacity: menuOpen ? 0 : 1 }} />
          <span
            style={{
              ...s.hbar,
              transform: menuOpen
                ? "rotate(-45deg) translate(5px,-5px)"
                : "none",
            }}
          />
        </button>
      </header>

      {menuOpen && (
        <div style={s.drawer}>
          <SideNavItem
            label="Início"
            active={page === "dashboard"}
            onClick={() => navigate("dashboard")}
            drawer
          />
          <SideNavItem
            label="Transações"
            active={page === "transactions"}
            onClick={() => navigate("transactions")}
            drawer
          />
        </div>
      )}

      {/* MAIN */}
      <main style={s.main} className="main-content">
        {page === "dashboard" ? (
          <Dashboard
            totalBalance={totalBalance}
            totalExpense={totalExpense}
            transactions={transactions}
            recipient={recipient}
            setRecipient={setRecipient}
            amount={amount}
            setAmount={setAmount}
            sendMoney={sendMoney}
            sending={sending}
            errorMsg={errorMsg}
          />
        ) : (
          <Transactions transactions={transactions} />
        )}
      </main>

      {/* BOTTOM NAV — mobile */}
      <nav style={s.bottomNav} className="bottom-nav">
        <BotNavItem
          label="Início"
          active={page === "dashboard"}
          onClick={() => navigate("dashboard")}
        />
        <BotNavItem
          label="Transações"
          active={page === "transactions"}
          onClick={() => navigate("transactions")}
        />
      </nav>
    </div>
  );
}

function SideNavItem({ label, active, onClick, drawer }) {
  return (
    <button
      onClick={onClick}
      className="nav-item"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: drawer ? "14px 20px" : "10px 12px",
        borderRadius: drawer ? 0 : 10,
        background: active ? "rgba(99,102,241,0.12)" : "transparent",
        border: "none",
        cursor: "pointer",
        color: active ? "#c7d2fe" : "#666",
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        width: "100%",
        textAlign: "left",
        fontFamily: "inherit",
        borderBottom: drawer ? "1px solid rgba(255,255,255,0.05)" : "none",
      }}
    >
      {label}
    </button>
  );
}

function BotNavItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        border: "none",
        background: "transparent",
        color: active ? "#c7d2fe" : "#555",
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        padding: "10px 0",
        fontFamily: "inherit",
        borderTop: active ? "2px solid #6366f1" : "2px solid transparent",
      }}
    >
      {label}
    </button>
  );
}

function Dashboard({
  totalBalance,
  totalExpense,
  transactions,
  recipient,
  setRecipient,
  amount,
  setAmount,
  sendMoney,
  sending,
  errorMsg,
}) {
  const noFunds = totalBalance <= 0;

  return (
    <div style={s.dashContent}>
      <div style={s.topRow}>
        <div>
          <div style={s.pageTitle}>Visão Geral</div>
          <div style={s.pageSubtitle}>Bem-vindo de volta 👋</div>
        </div>
        <div style={s.dateBadge} className="date-badge">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </div>
      </div>

      <div style={s.heroRow} className="hero-row">
        <div style={{ ...s.balanceCard, flex: 2 }} className="balance-card">
          <div style={s.balanceCardBg} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={s.balanceLabel}>Saldo Total</div>
            <div
              style={{
                ...s.balanceAmount,
                color: totalBalance < 0 ? "#f87171" : "#f0f0ff",
              }}
            >
              {formatCurrency(totalBalance)}
            </div>
            {noFunds && <div style={s.noFundsBadge}>Saldo esgotado</div>}
          </div>
          <div style={s.balanceDeco}>
            <svg
              width="200"
              height="110"
              viewBox="0 0 220 120"
              fill="none"
              style={{ opacity: 0.07 }}
            >
              <circle cx="180" cy="20" r="90" stroke="white" strokeWidth="40" />
              <circle cx="40" cy="100" r="60" stroke="white" strokeWidth="24" />
            </svg>
          </div>
        </div>

        <div
          style={{
            ...s.card,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#555",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Total gasto
          </div>
          <div
            style={{
              fontSize: "clamp(20px,3vw,28px)",
              fontWeight: 800,
              color: "#f87171",
              letterSpacing: "-0.5px",
            }}
          >
            {formatCurrency(totalExpense)}
          </div>
          <div style={{ fontSize: 12, color: "#444" }}>
            {transactions.filter((t) => t.value < 0).length} transações
          </div>
        </div>
      </div>

      <div style={s.midRow} className="mid-row">
        <div style={s.card}>
          <div style={s.cardHeader}>
            <span style={s.cardTitle}>Gastos mensais</span>
            <span style={s.cardTag}>últimos 7 meses</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={CHART_DATA}
              barSize={22}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="mes"
                tick={{ fill: "#555", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#444", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `R$${v}`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="valor" radius={[6, 6, 2, 2]}>
                {CHART_DATA.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === 3 ? "#6366f1" : "rgba(255,255,255,0.07)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={s.card}>
          <div style={s.cardHeader}>
            <span style={s.cardTitle}>Transferir</span>
          </div>

          {noFunds ? (
            <div style={s.noFundsBox}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>💸</div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#f87171",
                  marginBottom: 4,
                }}
              >
                Saldo insuficiente
              </div>
              <div style={{ fontSize: 12, color: "#555", textAlign: "center" }}>
                Você não possui saldo disponível para realizar transferências.
              </div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 14 }}>
                <div style={s.fieldLabel}>Destinatário</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {CONTACTS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setRecipient(c.name)}
                      className="contact-btn"
                      style={{
                        ...s.contactBtn,
                        ...(recipient === c.name ? s.contactActive : {}),
                      }}
                    >
                      <div
                        style={{
                          ...s.contactAv,
                          background:
                            recipient === c.name
                              ? "linear-gradient(135deg,#6366f1,#818cf8)"
                              : "rgba(255,255,255,0.08)",
                          color: recipient === c.name ? "#fff" : "#aaa",
                        }}
                      >
                        {c.initials}
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          color: recipient === c.name ? "#c7d2fe" : "#555",
                        }}
                      >
                        {c.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={s.fieldLabel}>Valor</div>
                <div style={s.amountWrap}>
                  <span style={{ fontSize: 13, color: "#555", marginRight: 6 }}>
                    R$
                  </span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) =>
                      setAmount(formatAmountInput(e.target.value))
                    }
                    placeholder="0,00"
                    style={s.amountInput}
                    inputMode="numeric"
                  />
                </div>
              </div>

              {errorMsg && <div style={s.errorMsg}>{errorMsg}</div>}

              <button
                onClick={sendMoney}
                disabled={!recipient || !amount || sending}
                className="send-btn"
                style={{
                  ...s.sendBtn,
                  opacity: !recipient || !amount ? 0.4 : 1,
                }}
              >
                {sending ? "Enviando..." : "Enviar agora →"}
              </button>
            </>
          )}
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardHeader}>
          <span style={s.cardTitle}>Transações recentes</span>
          <span style={{ fontSize: 12, color: "#6366f1", cursor: "pointer" }}>
            Ver todas
          </span>
        </div>
        {transactions.length === 0 ? (
          <div
            style={{
              padding: "24px 0",
              textAlign: "center",
              color: "#444",
              fontSize: 13,
            }}
          >
            Nenhuma transação ainda.
          </div>
        ) : (
          transactions.slice(0, 4).map((t, i) => (
            <div
              key={i}
              style={{
                ...s.txRow,
                borderBottom:
                  i < Math.min(3, transactions.length - 1)
                    ? "1px solid rgba(255,255,255,0.05)"
                    : "none",
              }}
            >
              <div
                style={{
                  ...s.txAv,
                  background:
                    t.value > 0
                      ? "rgba(74,222,128,0.12)"
                      : "rgba(248,113,113,0.12)",
                  color: t.value > 0 ? "#4ade80" : "#f87171",
                }}
              >
                {t.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={s.txName}>{t.name}</div>
                <div style={s.txMeta}>
                  {t.type} · {t.date}
                </div>
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "-0.3px",
                  color: t.value > 0 ? "#4ade80" : "#f87171",
                  flexShrink: 0,
                }}
              >
                {t.value > 0 ? "+" : "-"}
                {formatCurrency(Math.abs(t.value))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const s = {
  root: {
    display: "flex",
    minHeight: "100vh",
    background: "#0a0a0f",
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
    color: "#e8e8f0",
    position: "relative",
  },
  sidebar: {
    width: 210,
    minHeight: "100vh",
    background: "#0f0f18",
    borderRight: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 14px",
    flexShrink: 0,
  },
  topbar: {
    display: "none",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    background: "#0f0f18",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 18px",
    zIndex: 100,
  },
  menuBtn: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 6,
  },
  hbar: {
    display: "block",
    width: 22,
    height: 2,
    background: "#aaa",
    borderRadius: 2,
    transition: "all 0.2s",
  },
  drawer: {
    position: "fixed",
    top: 56,
    left: 0,
    right: 0,
    background: "#0f0f18",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    zIndex: 99,
  },
  bottomNav: {
    display: "none",
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#0f0f18",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    zIndex: 100,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 32,
    paddingLeft: 4,
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 9,
    background: "linear-gradient(135deg,#6366f1,#4f46e5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 17,
    fontWeight: 700,
    letterSpacing: "-0.5px",
    color: "#f0f0ff",
  },
  navGroup: { display: "flex", flexDirection: "column", gap: 2, flex: 1 },
  sidebarUser: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 8px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    marginTop: 16,
  },
  userAvatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#6366f1,#818cf8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    color: "#fff",
    flexShrink: 0,
  },
  main: {
    flex: 1,
    overflowY: "auto",
    padding: "32px 28px",
    minWidth: 0,
    display: "flex",
    justifyContent: "center",
  },
  dashContent: {
    width: "100%",
    maxWidth: 1180,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 8,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "-0.5px",
    color: "#f0f0ff",
  },
  pageSubtitle: { fontSize: 13, color: "#555", marginTop: 2 },
  dateBadge: {
    fontSize: 12,
    color: "#555",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    padding: "6px 14px",
    borderRadius: 20,
    textTransform: "capitalize",
    whiteSpace: "nowrap",
  },
  heroRow: {
    display: "flex",
    gap: 14,
  },
  balanceCard: {
    position: "relative",
    background: "linear-gradient(135deg,#1e1b4b 0%,#1a1035 50%,#0f0a2a 100%)",
    border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: 20,
    padding: "26px 28px",
    overflow: "hidden",
    minWidth: 0,
  },
  balanceCardBg: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse at 80% 50%,rgba(99,102,241,0.15) 0%,transparent 60%)",
  },
  balanceLabel: {
    fontSize: 11,
    color: "#8b8bbf",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: "clamp(24px,4vw,38px)",
    fontWeight: 800,
    letterSpacing: "-1.5px",
    lineHeight: 1.1,
  },
  noFundsBadge: {
    display: "inline-block",
    marginTop: 10,
    background: "rgba(248,113,113,0.15)",
    border: "1px solid rgba(248,113,113,0.3)",
    color: "#f87171",
    fontSize: 11,
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 20,
    letterSpacing: "0.04em",
  },
  balanceDeco: {
    position: "absolute",
    right: 0,
    top: 0,
    pointerEvents: "none",
  },
  midRow: {
    display: "grid",
    gridTemplateColumns: "1.6fr 1fr",
    gap: 14,
  },
  card: {
    background: "#0f0f18",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 20,
    padding: "20px 22px",
    minWidth: 0,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: { fontSize: 14, fontWeight: 600, color: "#d0d0e8" },
  cardTag: {
    fontSize: 10,
    color: "#555",
    background: "rgba(255,255,255,0.04)",
    padding: "3px 10px",
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.06)",
  },
  fieldLabel: {
    fontSize: 10,
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 10,
  },
  contactBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
    padding: "8px 4px",
    borderRadius: 12,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.06)",
    cursor: "pointer",
    transition: "all 0.15s",
    flex: 1,
    fontFamily: "inherit",
  },
  contactActive: {
    borderColor: "rgba(99,102,241,0.5)",
    background: "rgba(99,102,241,0.08)",
  },
  contactAv: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 700,
    transition: "all 0.15s",
  },
  amountWrap: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "0 14px",
    height: 46,
  },
  amountInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: 20,
    fontWeight: 700,
    color: "#f0f0ff",
    letterSpacing: "-0.3px",
    fontFamily: "inherit",
  },
  errorMsg: {
    fontSize: 12,
    color: "#f87171",
    background: "rgba(248,113,113,0.08)",
    border: "1px solid rgba(248,113,113,0.2)",
    borderRadius: 8,
    padding: "8px 12px",
    marginBottom: 12,
  },
  sendBtn: {
    width: "100%",
    height: 44,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg,#6366f1,#4f46e5)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  noFundsBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    textAlign: "center",
  },
  txRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "13px 0",
  },
  txAv: {
    width: 38,
    height: 38,
    borderRadius: 11,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
    flexShrink: 0,
  },
  txName: { fontSize: 14, fontWeight: 500, color: "#d0d0e8" },
  txMeta: { fontSize: 11, color: "#555", marginTop: 2 },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
  input::placeholder { color: #444; }

  .nav-item:hover { background: rgba(255,255,255,0.04) !important; color: #c0c0d8 !important; }
  .contact-btn:hover { border-color: rgba(99,102,241,0.3) !important; }
  .send-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
  .send-btn:active:not(:disabled) { transform: translateY(0); }
  .balance-card:hover { box-shadow: 0 0 40px rgba(99,102,241,0.1); }

  /* Tablet */
  @media (max-width: 900px) {
    .sidebar { display: none !important; }
    .topbar { display: flex !important; }
    .main-content { padding-top: 68px !important; padding-left: 16px !important; padding-right: 16px !important; }
    .mid-row { grid-template-columns: 1fr !important; }
  }

  /* Mobile */
  @media (max-width: 600px) {
    .bottom-nav { display: flex !important; }
    .main-content { padding-bottom: 68px !important; padding-left: 12px !important; padding-right: 12px !important; }
    .date-badge { display: none !important; }
    .hero-row { flex-direction: column !important; }
  }
`;
