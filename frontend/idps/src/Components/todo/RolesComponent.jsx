import React, { useState, useEffect } from "react";
import { createNewRoleApi, retrieveAllAppsApi } from "./api/IdpsApiService";
import { useNavigate } from "react-router-dom";
import { Field, Formik, Form, ErrorMessage } from "formik";
import "./IdpsApp.css";

export default function RolesComponent() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    retrieveApplications();
  }, []);

  function retrieveApplications() {
    retrieveAllAppsApi()
      .then((response) => {
        setApplications(response.data);
      })
      .catch((error) => console.log(error));
  }

  function onSubmit(values, { setSubmitting }) {
    const newRole = {
      roleName: values.roleName.toUpperCase(),
      roleDescription: values.roleDescription,
    };

    createNewRoleApi(values.applicationId, newRole)
      .then(() => {
        navigate("/application/view");
      })
      .catch((error) => console.log(error))
      .finally(() => setSubmitting(false));
  }

  function validate(values) {
    const errors = {};

    if (!values.roleName) {
      errors.roleName = "Role name is required";
    }

    if (!values.roleDescription) {
      errors.roleDescription = "Role description is required";
    }

    if (!values.applicationId) {
      errors.applicationId = "Please select an application";
    }

    return errors;
  }

  return (
    <div className="container roles-container">
      <h1>Add New Role</h1>
      <Formik
        initialValues={{
          roleName: "",
          roleDescription: "",
          applicationId: "",
        }}
        onSubmit={onSubmit}
        validate={validate}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {(props) => (
          <Form className="roles-form">
            <div className="form-group">
              <label htmlFor="roleName">Role Name</label>
              <Field
                type="text"
                className="form-control"
                name="roleName"
                onBlur={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
              <ErrorMessage
                name="roleName"
                component="div"
                className="error-message"
              />
            </div>
            <div className="form-group">
              <label htmlFor="roleDescription">Role Description</label>
              <Field
                type="text"
                className="form-control"
                name="roleDescription"
              />
              <ErrorMessage
                name="roleDescription"
                component="div"
                className="error-message"
              />
            </div>
            <div className="form-group">
              <label htmlFor="applicationId">Select Application</label>
              <Field
                as="select"
                className="form-control"
                name="applicationId"
                onChange={(e) => {
                  props.handleChange(e);
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

            <div>
              <button
                className="btn btn-primary submit-btn"
                type="submit"
                disabled={props.isSubmitting}
              >
                {props.isSubmitting ? "Adding..." : "Add Role"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
