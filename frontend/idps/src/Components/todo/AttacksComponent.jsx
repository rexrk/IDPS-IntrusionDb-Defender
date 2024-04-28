import { useState, useEffect } from "react";
import { deleteAttackApi, retrieveAllAttacksApi } from "./api/IdpsApiService";
import ReactCountryFlag from "react-country-flag";
import "./IdpsApp.css";

export default function AttacksComponent() {
  const [attacks, setAttacks] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    refreshAttacks();
    const intervalId = setInterval(refreshAttacks, 2000);
    return () => clearInterval(intervalId);
  }, []);

  function refreshAttacks() {
    retrieveAllAttacksApi()
      .then((response) => {
        setAttacks(response.data.reverse());
      })
      .catch((error) => console.log(error));
  }

  function deleteAttack(id) {
    deleteAttackApi(id)
      .then(() => {
        setMessage(`Delete attack with id: ${id} successful`);
        refreshAttacks();
      })
      .catch((error) => console.log(error));
  }

  function getStatusBadge(severity) {
    let badgeClass = "badge bg-secondary";

    if (severity === "Low") {
      badgeClass = "badge bg-success";
    } else if (severity === "Medium") {
      badgeClass = "badge bg-warning text-dark";
    } else if (severity === "High") {
      badgeClass = "badge bg-danger";
    }

    return <span className={badgeClass}>{severity}</span>;
  }

  const countryMapping = {
    // Add your country name to ISO 3166-1 alpha-2 code mappings here
    India: "IN",
    "unknown location": "PK"
  };

  let serialNumber = 0;
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Adjust the format as needed
  };

  return (
    <div className="container">
      <h1>Recent Attacks</h1>
      {message && <div className="alert alert-warning">{message}</div>}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Attacker</th>
              <th>Application</th>
              <th>Timestamp</th>
              <th>Ip address</th>
              <th>Location</th>
              <th>Target</th>
              <th>Description</th>
              <th>Attack Type</th>
              <th>Severity</th>
              <th className="text-secondary">Status</th>
              <th className="text-danger">Delete</th>
            </tr>
          </thead>

          <tbody>
            {attacks.map((attack) => (
              <tr key={attack.id}>
                <td>{++serialNumber}</td>
                <td
                  className="badge badge-primary text-wrap"
                  style={{
                    width: "6rem",
                    margin: "auto",
                    marginTop: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #dee2e6",
                  }}
                >
                  {attack.attackerUsername}
                </td>
                <td>{attack.applicationName}</td>
                <td>{formatDate(attack.timestamp)}</td>
                <td>{attack.attackerIpAddress}</td>
                <td>
                  {countryMapping[attack.attackerLocation] && (
                    <ReactCountryFlag
                      countryCode={countryMapping[attack.attackerLocation]}
                      svg
                      style={{ width: "4em", height: "20px" }}
                    />
                  )}
                </td>
                <td>{attack.targetedResource}</td>
                <td>{attack.description}</td>
                <td>{attack.attackType}</td>
                <td>{getStatusBadge(attack.severityLevel)}</td>
                <td>{getStatusBadge(attack.status)}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    style={{ padding: "5px 10px", fontSize: "10px" }}
                    onClick={() => deleteAttack(attack.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
