import { useEffect, useState } from "react";

function Admin() {
  const [pendingReports, setPendingReports] = useState([]);
  const [activeReports, setActiveReports] = useState([]);

  const loadData = async () => {
    try {
      const pendingResponse = await fetch(
        "http://192.168.100.9:8000/reports/pending"
      );

      const activeResponse = await fetch(
        "http://192.168.100.9:8000/reports/active"
      );

      const pendingData =
        await pendingResponse.json();

      const activeData =
        await activeResponse.json();

      setPendingReports(pendingData);
      setActiveReports(activeData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const approveReport = async (id) => {
    await fetch(
      `http://192.168.100.9:8000/reports/${id}/approve`,
      {
        method: "PUT",
      }
    );

    loadData();
  };

  const rejectReport = async (id) => {
    await fetch(
      `http://192.168.100.9:8000/reports/${id}/reject`,
      {
        method: "PUT",
      }
    );

    loadData();
  };

  const removeReport = async (id) => {
    await fetch(
      `http://192.168.100.9:8000/reports/${id}/remove`,
      {
        method: "PUT",
      }
    );

    loadData();
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1>Painel Administrativo</h1>

      <hr />

      <h2>Barricadas Pendentes</h2>

      {pendingReports.length === 0 ? (
        <p>Nenhuma barricada pendente.</p>
      ) : (
        pendingReports.map((report) => (
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

      <hr />

      <h2>Barricadas Ativas</h2>

      {activeReports.length === 0 ? (
        <p>Nenhuma barricada ativa.</p>
      ) : (
        activeReports.map((report) => (
          <div
            key={report.id}
            style={{
              border: "1px solid #4caf50",
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
                removeReport(report.id)
              }
            >
              Remover do mapa
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Admin;