import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert, Spinner, Row, Col } from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    salary: "",
    gender: "Male",
    birthdate: "",
    department: "",
  });
  
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const depRes = await axios.get("http://localhost:9999/departments");
        setDepartments(depRes.data);

        const empRes = await axios.get(`http://localhost:9999/employees/${id}`);
        const empData = empRes.data;
        setEmployee(empData);
        
        setFormData({
          firstName: empData.empName.firstName,
          lastName: empData.empName.lastName,
          salary: empData.empSalary,
          gender: empData.empGender,
          birthdate: empData.empBirthdate,
          department: empData.depId,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSubmitError("Employee not found or an error occurred.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name cannot be empty.";
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name cannot be empty.";
    }
    if (!formData.salary || Number(formData.salary) <= 0) {
      newErrors.salary = "Salary must be a positive number greater than 0.";
    }
    if (!formData.department) {
      newErrors.department = "Please select a department.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const updatedEmployee = {
          ...employee,
          empName: {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
          },
          empSalary: Number(formData.salary),
          empGender: formData.gender,
          empBirthdate: formData.birthdate,
          depId: Number(formData.department),
        };

        await axios.put(`http://localhost:9999/employees/${id}`, updatedEmployee);
        window.alert("Employee profile updated successfully!");
        navigate("/");
      } catch (err) {
        console.error("Error updating employee:", err);
        setSubmitError("Failed to update employee. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading information...</p>
      </Container>
    );
  }

  if (!employee && submitError) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{submitError}</Alert>
        <Link to="/" className="btn btn-secondary">Back to Home</Link>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div style={{ maxWidth: "600px", margin: "0 auto" }} className="border rounded p-4 shadow-sm bg-white">
        <h2 className="mb-4 text-center">Edit Employee Profile</h2>
        {submitError && <Alert variant="danger">{submitError}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              isInvalid={!!errors.firstName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.firstName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              isInvalid={!!errors.lastName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.lastName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formSalary">
            <Form.Label>Salary (VNĐ)</Form.Label>
            <Form.Control
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              isInvalid={!!errors.salary}
            />
            <Form.Control.Feedback type="invalid">
              {errors.salary}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="formDepartment">
            <Form.Label>Department</Form.Label>
            <Form.Select
              name="department"
              value={formData.department}
              onChange={handleChange}
              isInvalid={!!errors.department}
            >
              <option value="">Select a department</option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.depName}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.department}
            </Form.Control.Feedback>
          </Form.Group>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="formGender">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">-- Select Gender --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formBirthdate">
                <Form.Label>Birthdate</Form.Label>
                <Form.Control
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-3">
            <Link to="/" className="btn btn-outline-secondary px-4">
              Cancel
            </Link>
            <Button variant="warning" type="submit" className="px-4 fw-bold">
              Save Changes
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default EditEmployee;
