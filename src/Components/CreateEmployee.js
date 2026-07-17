import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateEmployee = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    salary: "",
    gender: "",
    birthdate: "",
    department: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:9999/departments");
        setDepartments(res.data);
      } catch (err) {
        console.error("Error fetching departments", err);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required and cannot be empty.";
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required and cannot be empty.";
    }
    if (
      !formData.salary ||
      isNaN(formData.salary) ||
      Number(formData.salary) <= 0
    ) {
      newErrors.salary = "Salary must be a positive number greater than zero.";
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
        const empListRes = await axios.get("http://localhost:9999/employees");
        const maxId = empListRes.data.reduce((max, emp) => {
          const currentId = parseInt(emp.id, 10);
          return currentId > max ? currentId : max;
        }, 0);
        const newId = (maxId + 1).toString();

        const newEmployee = {
          id: newId,
          empName: {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
          },
          empSalary: Number(formData.salary),
          empGender: formData.gender,
          empBirthdate: formData.birthdate,
          depId: Number(formData.department),
          supervisorId: null,
          dependents: [],
        };

        await axios.post("http://localhost:9999/employees", newEmployee);
        window.alert("Employee created successfully!");
        navigate("/");
      } catch (err) {
        setSubmitError("Failed to create employee. Please try again.");
      }
    }
  };

  return (
    <Container className="mt-5">
      <div style={{ maxWidth: "600px", margin: "0 auto" }} className="border rounded p-4 shadow-sm bg-white">
        <h2 className="mb-4 text-center">Create New Employee</h2>
        {submitError && <Alert variant="danger">{submitError}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Last Name <span className="text-danger">*</span>
            </Form.Label>
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

          <Form.Group className="mb-3">
            <Form.Label>
              First Name <span className="text-danger">*</span>
            </Form.Label>
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

          <Form.Group className="mb-3">
            <Form.Label>
              Salary <span className="text-danger">*</span>
            </Form.Label>
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

          <Form.Group className="mb-3">
            <Form.Label>
              Gender
            </Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              isInvalid={!!errors.gender}
            >
              <option value="">-- Select Gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.gender}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Birthdate
            </Form.Label>
            <Form.Control
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              isInvalid={!!errors.birthdate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.birthdate}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Department <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="department"
              value={formData.department}
              onChange={handleChange}
              isInvalid={!!errors.department}
            >
              <option value="">-- Select Department --</option>
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

          <div className="d-flex justify-content-between gap-3 mt-4">
            <Button variant="success" type="submit" className="w-100">
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/")}
              className="w-100"
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default CreateEmployee;
