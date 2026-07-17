import React, { useState, useEffect } from "react";
import { Table, Button, Form, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [workons, setWorkons] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeps, setSelectedDeps] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const empRes = await axios.get("http://localhost:9999/employees");
      const depRes = await axios.get("http://localhost:9999/departments");
      const proRes = await axios.get("http://localhost:9999/projects");
      const workRes = await axios.get("http://localhost:9999/workons");

      const sortedEmp = empRes.data.sort((a, b) => b.empSalary - a.empSalary);
      setEmployees(sortedEmp);
      setDepartments(depRes.data);
      setProjects(proRes.data);
      setWorkons(workRes.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`http://localhost:9999/employees/${id}`);
        setEmployees(employees.filter((emp) => emp.id !== id));
      } catch (error) {
        console.error("Error deleting employee: ", error);
      }
    }
  };

  const handleDepChange = (depId) => {
    if (selectedDeps.includes(depId)) {
      setSelectedDeps(selectedDeps.filter((id) => id !== depId));
    } else {
      setSelectedDeps([...selectedDeps, depId]);
    }
  };

  const getDepartmentName = (depId) => {
    const dep = departments.find((d) => d.id.toString() === depId.toString());
    return dep ? dep.depName : "Unknown";
  };

  const getProjectsForEmployee = (empId) => {
    const empWorkons = workons.filter(
      (w) => w.empId.toString() === empId.toString(),
    );
    if (empWorkons.length === 0) return "Has not participated.";

    const projectDetails = empWorkons.map((w) => {
      const project = projects.find(
        (p) => p.id.toString() === w.proId.toString(),
      );
      const projectName = project ? project.proName : "Unknown Project";
      return `${projectName} (${w.workHours} hours)`;
    });

    return projectDetails.join("; ");
  };

  const filteredEmployees = employees.filter((emp) => {
    const first = emp.empName.firstName.toLowerCase();
    const last = emp.empName.lastName.toLowerCase();
    const searchMatch =
      first.includes(searchTerm.toLowerCase()) ||
      last.includes(searchTerm.toLowerCase());

    const depMatch =
      selectedDeps.length === 0 || selectedDeps.includes(emp.depId.toString());

    return searchMatch && depMatch;
  });

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4 text-center">EMPLOYEE MANAGEMENT SYSTEM</h2>
      <Row>
        <Col md={2}>
          <div className="p-3 border rounded">
            <h5>Departments </h5>
            <hr />
            <Form>
              {departments.map((dep) => (
                <Form.Check
                  key={dep.id}
                  type="checkbox"
                  id={`dep-${dep.id}`}
                  label={dep.depName}
                  checked={selectedDeps.includes(dep.id.toString())}
                  onChange={() => handleDepChange(dep.id.toString())}
                />
              ))}
              {selectedDeps.length > 0 && (
                <Button 
                  variant="outline-danger" 
                  className="w-100 mt-3" 
                  size="sm"
                  onClick={() => setSelectedDeps([])}
                >
                  Reset Filter
                </Button>
              )}
            </Form>
          </div>
        </Col>
        <Col md={10}>
          <div className="d-flex justify-content-between mb-3">
            <Form.Control
              type="text"
              placeholder="Search employee by fullname"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "1100px" }}
            />
            <Link to="/employee/create" className="btn btn-primary fw-bold">
              Create Employee
            </Link>
          </div>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Salary</th>
                <th>Gender</th>
                <th>Department</th>
                <th>Dependents</th>
                <th>Projects (Total Hours)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp, index) => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td className="fw-bold">
                      {emp.empName.lastName} {emp.empName.firstName}
                    </td>
                    <td>{emp.empSalary.toLocaleString()} VND</td>
                    <td>{emp.empGender}</td>
                    <td>{getDepartmentName(emp.depId)}</td>
                    <td>{emp.dependents ? emp.dependents.length : 0} people</td>
                    <td>{getProjectsForEmployee(emp.id)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link to={`/employee/detail/${emp.id}`} className="btn btn-success btn-sm">Detail</Link>
                        <Link to={`/employee/edit/${emp.id}`} className="btn btn-warning btn-sm">Edit</Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(emp.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeeList;
