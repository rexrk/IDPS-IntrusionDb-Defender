import React, { useState, useEffect } from "react";
import { retrieveAllAppsApi, retrieveRolesApi, createRolePrivilegeApi, retrieveAppRoleApi } from "./api/IdpsApiService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import "./IdpsApp.css"; // Import your CSS file

const privileges = ["SELECT", "INSERT", "UPDATE", "DELETE", "DROP", "ALTER"];
export default function RolePrivilegeComponent() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPrivileges, setSelectedPrivileges] = useState([]);

  useEffect(() => {
    retrieveApplications();
  }, []);

  const retrieveApplications = () => {
    retrieveAllAppsApi()
      .then((response) => {
        setApplications(response.data);
      })
      .catch((error) => console.log(error));
  };

  const retrieveRolesForApp = (appId) => {
    retrieveRolesApi(appId)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setRoles(response.data);
          // If there's only one role, select it automatically and fetch its details
          if (response.data.length === 1) {
            const selectedRoleId = response.data[0].roleId;
            setSelectedRoleId(selectedRoleId);
            fetchRoleDetails(selectedRoleId);
          }
        } else {
          console.error("Invalid response format for roles:", response);
        }
      })
      .catch((error) => console.log("Error fetching roles:", error));
  };
  
  const fetchRoleDetails = (roleId) => {
    // Fetch role details for the selected role using your API
    retrieveAppRoleApi(selectedAppId, roleId)
      .then((response) => {
        setSelectedRole(response.data);
      })
      .catch((error) => console.error("Error fetching role details:", error));
  };
  const handleSubmit = async (values) => {
    const { applicationId, roleId, privileges } = values;
    try {
      // Fetch the current role details to ensure roleName and roleDescription are not changed
      const roleDetailsResponse = await retrieveAppRoleApi(applicationId, roleId);
      const roleDetails = roleDetailsResponse.data;
      
      // Update the role with the added privileges
      const updatedRole = { ...roleDetails, privileges };
      const updateRoleResponse = await createRolePrivilegeApi(applicationId, roleId, updatedRole);
      
      // You might want to refresh the roles or do other actions upon successful addition
      navigate("/application/view");
    } catch (error) {
      console.error("Error adding role privilege:", error);
    }
  };

  function validate(values) {
    const errors = {};
    if (!values.applicationId) {
      errors.applicationId = 'Application is required';
    }
    if (!values.roleId) {
      errors.roleId = 'Role is required';
    }
    return errors;
  }

  return (
    <div className="container">
      <h1>Add Role Privilege</h1>
      <Formik
        initialValues={{
          applicationId: "",
          roleId: selectedRoleId,
          privileges: []
        }}
        onSubmit={handleSubmit}
        validate={validate}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ values, setFieldValue }) => (
          <Form className="roles-form">
            <div className="form-group">
              <label htmlFor="applicationId">Select Application</label>
              <Field
                as="select"
                className="form-control"
                name="applicationId"
                onChange={(e) => {
                  const appId = e.target.value;
                  setSelectedAppId(appId);
                  retrieveRolesForApp(appId);
                  setFieldValue("applicationId", appId);
                }}
              >
                <option value="">Select an application</option>
                {applications.map((app) => (
                  <option key={app.applicationId} value={app.applicationId}>
                    {app.applicationName}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="applicationId"
                component="div"
                className="error-message"
              />
            </div>
            
            {selectedAppId && (
              <div className="form-group">
                <label htmlFor="roleId">Select Role:</label>
                <Field as="select" name="roleId" className="form-control">
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </option>
                  ))}
                </Field>
              </div>
            )}

            <div className="form-group">
              <label>Privileges:</label>
              {privileges.map((privilege) => (
                <div key={privilege} className="form-check">
                  <Field
                    type="checkbox"
                    id={privilege}
                    name="privileges"
                    value={privilege}
                    className="form-check-input"
                    checked={values.privileges.includes(privilege)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const updatedPrivileges = checked
                        ? [...values.privileges, privilege]
                        : values.privileges.filter((p) => p !== privilege);
                      setFieldValue("privileges", updatedPrivileges);
                      setSelectedPrivileges(updatedPrivileges);
                    }}
                  />
                  <label htmlFor={privilege} className="form-check-label">{privilege}</label>
                </div>
              ))}
            </div>

            <button type="submit" className="btn btn-primary">Add Privileges</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
