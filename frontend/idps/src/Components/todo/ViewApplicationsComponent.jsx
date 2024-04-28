import React, { useState, useEffect } from "react";
import { retrieveAllAppsApi, deleteAppApi, retrieveRolesApi } from "./api/IdpsApiService";

export default function ViewApplicationsComponent() {
  const [applications, setApplications] = useState([]);
  
  useEffect(() => {
    retrieveAllApplications();
  }, []);

  const retrieveAllApplications = () => {
    retrieveAllAppsApi()
      .then((response) => {
        setApplications(response.data.reverse());
        fetchRolesForApplications(response.data);
      })
      .catch((error) => console.log(error));
  };

  const fetchRolesForApplications = (apps) => {
    const rolePromises = apps.map((app) => {
      return retrieveRolesApi(app.applicationId)
        .then((response) => {
          return {
            ...app,
            roles: response.data,
          };
        })
        .catch((error) => {
          console.log(error);
          return {
            ...app,
            roles: [],
          };
        });
    });

    Promise.all(rolePromises)
      .then((updatedApps) => {
        setApplications(updatedApps);
      })
      .catch((error) => console.log(error));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      deleteAppApi(id)
        .then(() => {
          alert("Application deleted successfully.");
          retrieveAllApplications();
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="container">
      <h2>All Applications</h2>
      <div>
        {applications.map((app) => (
          <div key={app.applicationId} className="app-item">
            <div>
              <strong>Application Name:</strong> {app.applicationName}
            </div>
            <div>
              <strong>Description:</strong> {app.applicationDescription}
            </div>
            <div>
              <strong>Version:</strong> {app.applicationVersion}
            </div>
            <div>
              <strong>Roles:</strong>{" "}
              {app.roles && app.roles.map((role, index) => (
                <span key={role.roleId}>
                  {role.roleName}{index !== app.roles.length - 1 && ", "}
                </span>
              ))}
            </div>
            <div>
              <button
                className="btn btn-primary"
                onClick={() => handleDelete(app.applicationId)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
