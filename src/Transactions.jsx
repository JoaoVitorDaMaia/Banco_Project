import { useState } from "react";

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export default function Transactions({ transactions }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = transactions.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "income" && t.value > 0) ||
      (filter === "expense" && t.value < 0);
    return matchSearch && matchFilter;
  });

  return (
    <div style={st.root}>
      <style>{css}</style>

      <div style={st.header}>
        <h1 style={st.title}>Transações</h1>
        <p style={st.subtitle}>{transactions.length} registros no total</p>
      </div>

      <div style={st.controls} className="tx-controls">
        <div style={st.searchWrap}>
          <span style={st.searchIcon}>⌕</span>
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={st.searchInput}
          />
        </div>
        <div style={st.filterGroup}>
          {[
            { key: "all", label: "Todas" },
            { key: "income", label: "Receitas" },
            { key: "expense", label: "Despesas" },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="filter-btn"
              style={{ ...st.filterBtn, ...(filter === f.key ? st.filterActive : {}) }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={st.list}>
        {filtered.length === 0 ? (
          <div style={st.empty}>
            <div style={{ fontSize: 28 }}>◎</div>
            <p style={{ color: "#555", marginTop: 8, fontSize: 13 }}>Nenhuma transação encontrada</p>
          </div>
        ) : (
          filtered.map((t, i) => {
            const isPos = t.value > 0;
            return (
              <div
                key={i}
                className="tx-row"
                style={{
                  ...st.row,
                  borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
              >
                <div style={{
                  ...st.avatar,
                  background: isPos ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                  color: isPos ? "#4ade80" : "#f87171",
                }}>
                  {t.name.charAt(0)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={st.txName}>{t.name}</div>
                  <div style={st.txMeta}>{t.type} · {t.date}</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.3px", color: isPos ? "#4ade80" : "#f87171" }}>
                    {isPos ? "+" : "-"}{formatCurrency(Math.abs(t.value))}
                  </div>
                  <div style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 20,
                    background: isPos ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)",
                    color: isPos ? "#4ade80" : "#f87171",
                    border: `1px solid ${isPos ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
                  }}>
                    {isPos ? "crédito" : "débito"}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const st = {
  root: {
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
    color: "#e8e8f0",
    display: "flex", flexDirection: "column", gap: 16,
    maxWidth: 860,
  },
  header: { marginBottom: 2 },
  title: {
    fontSize: 22, fontWeight: 700,
    letterSpacing: "-0.5px", color: "#f0f0ff",
  },
  subtitle: { fontSize: 13, color: "#555", marginTop: 4 },
  controls: {
    display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap",
  },
  searchWrap: {
    flex: 1, minWidth: 160,
    display: "flex", alignItems: "center", gap: 8,
    background: "#0f0f18",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 12, padding: "0 14px", height: 42,
  },
  searchIcon: { fontSize: 17, color: "#444" },
  searchInput: {
    flex: 1, background: "transparent",
    border: "none", outline: "none",
    fontSize: 13, color: "#d0d0e8", fontFamily: "inherit",
  },
  filterGroup: {
    display: "flex", gap: 4,
    background: "#0f0f18",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 12, padding: "4px",
    flexShrink: 0,
  },
  filterBtn: {
    padding: "5px 12px", borderRadius: 8,
    border: "none", background: "transparent",
    cursor: "pointer", fontSize: 12, color: "#666",
    transition: "all 0.15s", fontFamily: "inherit",
    whiteSpace: "nowrap",
  },
  filterActive: {
    background: "rgba(99,102,241,0.15)", color: "#c7d2fe",
  },
  list: {
    background: "#0f0f18",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 20, overflow: "hidden",
  },
  row: {
    display: "flex", alignItems: "center",
    gap: 12, padding: "14px 18px",
    transition: "background 0.12s",
  },
  avatar: {
    width: 40, height: 40, borderRadius: 11,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 700, flexShrink: 0,
  },
  txName: { fontSize: 13, fontWeight: 500, color: "#d0d0e8" },
  txMeta: { fontSize: 11, color: "#555", marginTop: 2 },
  empty: {
    padding: "50px 0", textAlign: "center", color: "#444",
  },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  .tx-row:hover { background: rgba(255,255,255,0.02) !important; }
  .filter-btn:hover { color: #a0a0c0 !important; }
  input::placeholder { color: #444; }

  @media (max-width: 480px) {
    .tx-controls { flex-direction: column !important; align-items: stretch !important; }
    .tx-controls > * { width: 100% !important; }
  }
`;
