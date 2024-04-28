import { useNavigate } from "react-router-dom";
import { createNewAppApi } from "./api/IdpsApiService";
import { useState } from "react";
import { Field, Formik, Form, ErrorMessage } from "formik";

export default function AppComponent() {

  const [applicationName, setApplicationName] = useState("");
  const [applicationDescription, setApplicationDescription] = useState("");
  const [applicationVersion, setApplicationVersion] = useState("");

  const navigate = useNavigate();

  function onSubmit(values) {
    const application = {
      applicationName: values.applicationName,
      applicationDescription: values.applicationDescription,
      applicationVersion: values.applicationVersion,
    };

    createNewAppApi(application)
      .then(() => {
        navigate("/application/view");
        alert("Application added successfully.");
      })
      .catch((error) => console.log(error));
  }

  function validate(values) {
    let errors = {};

    if (!values.applicationName) {
      errors.applicationName = "Application name is required";
    }

    if (!values.applicationDescription) {
      errors.applicationDescription = "Description is required";
    }

    if (!values.applicationVersion) {
      errors.applicationVersion = "Version is required";
    }

    return errors;
  }

  return (
    <div className="container">
      <h1>Enter Application Details</h1>
      <div>
        <Formik
          initialValues={{
            applicationName,
            applicationDescription,
            applicationVersion,
          }}
          onSubmit={onSubmit}
          validate={validate}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {(props) => (
            <Form>
              <div className="form-group">
                <label htmlFor="applicationName">Application Name</label>
                <Field
                  type="text"
                  className="input-field"
                  name="applicationName"
                />
                <ErrorMessage
                  name="applicationName"
                  component="div"
                  className="error-message"
                />
              </div>
              <div className="form-group">
                <label htmlFor="applicationDescription">Description</label>
                <Field
                  type="text"
                  className="input-field"
                  name="applicationDescription"
                />
                <ErrorMessage
                  name="applicationDescription"
                  component="div"
                  className="error-message"
                />
              </div>
              <div className="form-group">
                <label htmlFor="applicationVersion">Version</label>
                <Field
                  type="text"
                  className="input-field"
                  name="applicationVersion"
                />
                <ErrorMessage
                  name="applicationVersion"
                  component="div"
                  className="error-message"
                />
              </div>
              <div>
                <button className="submit-btn" type="submit">
                  Add Application
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
