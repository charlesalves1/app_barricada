import { useEffect, useState } from "react";

function Admin() {
  const [reports, setReports] = useState([]);

  const loadPendingReports = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/reports/pending"
      );

      const data = await response.json();

      setReports(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadPendingReports();
  }, []);

  const approveReport = async (id) => {
    await fetch(
      `http://127.0.0.1:8000/reports/${id}/approve`,
      {
        method: "PUT",
      }
    );

    loadPendingReports();
  };

  const rejectReport = async (id) => {
    await fetch(
      `http://127.0.0.1:8000/reports/${id}/reject`,
      {
        method: "PUT",
      }
    );

    loadPendingReports();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Painel Administrativo</h1>

      <h2>Barricadas Pendentes</h2>

      {reports.length === 0 ? (
        <p>Nenhuma barricada pendente.</p>
      ) : (
        reports.map((report) => (
          <div
            key={report.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>ID:</strong> {report.id}
            </p>

            <p>
              <strong>Latitude:</strong>{" "}
              {report.latitude}
            </p>

            <p>
              <strong>Longitude:</strong>{" "}
              {report.longitude}
            </p>

            <button
              onClick={() =>
                approveReport(report.id)
              }
            >
              Aprovar
            </button>

            <button
              style={{
                marginLeft: "10px",
              }}
              onClick={() =>
                rejectReport(report.id)
              }
            >
              Rejeitar
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Admin;