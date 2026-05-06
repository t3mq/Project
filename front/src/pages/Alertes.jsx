import { useEffect, useState } from "react";
import { api } from "../api";

export default function Alertes() {
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlertes();
  }, []);

  const loadAlertes = async () => {
    try {
      const data = await api.alertes.getAll();
      setAlertes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const runAlertes = async () => {
    try {
      await api.alertes.run();
      loadAlertes();
    } catch (err) {
      console.error(err);
    }
  };

  const resolveAlerte = async (id) => {
    try {
      await api.alertes.resolve(id);
      loadAlertes();
    } catch (err) {
      console.error(err);
    }
  };

  const getBadge = (niveau) => {
    switch (niveau) {
      case "danger":
        return { color: "#fff", bg: "#e53935", label: "Danger" };
      case "warning":
        return { color: "#000", bg: "#fbc02d", label: "Warning" };
      default:
        return { color: "#fff", bg: "#1e88e5", label: "Info" };
    }
  };

  if (loading) return <p>Chargement des alertes...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>🚨 Alertes</h1>

      <button onClick={runAlertes} style={{ marginBottom: 15 }}>
        Générer les alertes
      </button>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Culture</th>
            <th>Règle</th>
            <th>Message</th>
            <th>Niveau</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {alertes.map((a) => {
            const badge = getBadge(a.niveau);

            return (
              <tr
                key={a.id_alerte}
                style={{
                  borderBottom: "1px solid #ddd",
                  background:
                    a.niveau === "danger"
                      ? "#ffe5e5"
                      : a.niveau === "warning"
                      ? "#fff8e1"
                      : "white",
                }}
              >
                <td>{new Date(a.date_alerte).toLocaleDateString()}</td>

                {/* ✅ adapté à ton SQL */}
                <td>{a.culture_nom || "-"}</td>
                <td>{a.regle_nom || "-"}</td>

                <td>{a.message}</td>

                <td>
                  <span
                    style={{
                      background: badge.bg,
                      color: badge.color,
                      padding: "4px 8px",
                      borderRadius: "5px",
                      fontSize: "12px",
                    }}
                  >
                    {badge.label}
                  </span>
                </td>

                <td>{a.statut}</td>

                <td>
                  {a.statut === "active" && (
                    <button onClick={() => resolveAlerte(a.id_alerte)}>
                      Résoudre
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}