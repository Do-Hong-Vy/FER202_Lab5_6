import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Table, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [departmentName, setDepartmentName] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const empRes = await axios.get(`http://localhost:9999/employees/${id}`);
        const empData = empRes.data;
        setEmployee(empData);

        const depRes = await axios.get(
          `http://localhost:9999/departments/${empData.depId}`,
        );
        setDepartmentName(depRes.data.depName);

        const workRes = await axios.get(
          `http://localhost:9999/workons?empId=${id}`,
        );
        const projRes = await axios.get("http://localhost:9999/projects");

        const empProjects = workRes.data.map((w) => {
          const project = projRes.data.find(
            (p) => p.id.toString() === w.proId.toString(),
          );
          return {
            projectName: project ? project.proName : "Unknown Project",
            hours: w.workHours,
          };
        });
        setProjects(empProjects);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching employee details:", err);
        setError("Employee not found or an error occurred.");
        setLoading(false);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    };

    fetchEmployeeDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading information...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error} Redirecting to Home Page...</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div
        className="border rounded p-4 shadow-sm bg-white"
        style={{ maxWidth: "800px", margin: "0 auto" }}
      >
        <h4 className="mb-3 fw-bold">
          Employee Profile: {employee.empName.lastName}{" "}
          {employee.empName.firstName}
        </h4>
        <div
          style={{ borderBottom: "2px solid #0d6efd", marginBottom: "2rem" }}
        ></div>

        <Row className="mb-4">
          <Col md={6}>
            <p>
              <strong>Employee ID:</strong> {employee.id}
            </p>
            <br />
            <p>
              <strong>Birthdate:</strong> {employee.empBirthdate}
            </p>
            <br />
            <p>
              <strong>Department:</strong> {departmentName}
            </p>
          </Col>
          <Col md={6}>
            <p>
              <strong>Gender:</strong> {employee.empGender}
            </p>
            <br />
            <p>
              <strong>Salary:</strong> {employee.empSalary.toLocaleString()} VND
            </p>
            <br />
            <p>
              <strong>Supervisor ID:</strong> {employee.supervisorId || "None"}
            </p>
          </Col>
        </Row>

        <h5 className="mt-4 fw-bold">
          Dependents ({employee.dependents ? employee.dependents.length : 0})
        </h5>
        <Table bordered>
          <thead style={{ backgroundColor: "#34495e", color: "white" }}>
            <tr>
              <th style={{ backgroundColor: "#34495e", color: "white" }}>
                Full Name
              </th>
              <th style={{ backgroundColor: "#34495e", color: "white" }}>
                Birthdate
              </th>
              <th style={{ backgroundColor: "#34495e", color: "white" }}>
                Relationship
              </th>
            </tr>
          </thead>
          <tbody>
            {employee.dependents && employee.dependents.length > 0 ? (
              employee.dependents.map((dep, index) => (
                <tr key={index}>
                  <td>{dep.fullName}</td>
                  <td>{dep.birthDate}</td>
                  <td>{dep.relationship}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  No dependents
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <h5 className="mt-4 fw-bold">Participating Projects</h5>
        <ul className="text-muted">
          {projects.length > 0 ? (
            projects.map((proj, index) => (
              <li key={index}>
                {proj.projectName} - Assigned hours: {proj.hours} hours
              </li>
            ))
          ) : (
            <li>Has not participated in any project.</li>
          )}
        </ul>

        <div className="mt-5 d-flex justify-content-end">
          <Link to="/" className="btn btn-primary px-4">
            Back to list
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default EmployeeDetail;
