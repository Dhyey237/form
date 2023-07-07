import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    marks: "",
    pass: false,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Form validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.marks
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!validatePhone(formData.phone)) {
      alert("Please enter a valid phone number.");
      return;
    }

    if (
      isNaN(formData.marks) ||
      Number(formData.marks) < 0 ||
      Number(formData.marks) > 100
    ) {
      alert("Please enter a valid marks value between 0 and 100.");
      return;
    }

    // Determine pass/fail status based on marks
    const marks = Number(formData.marks);
    const pass = marks > 35;

    // Add the student to the students array
    const newStudent = { ...formData, pass };
    setStudents([...students, newStudent]);

    // Clear the form after submission
    setFormData({
      name: "",
      email: "",
      phone: "",
      marks: "",
      pass: false,
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="app-container">
      <h1>Student Information List</h1>
      <table className="student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Marks</th>
            <th>Pass/Fail</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student, index) => (
            <tr key={index}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.phone}</td>
              <td>{student.marks}</td>
              <td>{student.pass ? "Pass" : "Fail"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        studentsPerPage={studentsPerPage}
        totalStudents={students.length}
        paginate={paginate}
      />

      <hr />

      <StudentForm
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

const Pagination = ({ studentsPerPage, totalStudents, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalStudents / studentsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      {pageNumbers.map((number) => (
        <button key={number} onClick={() => paginate(number)}>
          {number}
        </button>
      ))}
    </div>
  );
};

const StudentForm = ({ formData, handleInputChange, handleSubmit }) => {
  return (
    <div className="form-container">
      <h2>Create/Edit Student Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Marks:</label>
          <input
            type="text"
            name="marks"
            value={formData.marks}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Pass/Fail:</label>
          <input
            type="checkbox"
            name="pass"
            checked={formData.pass}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default App;
