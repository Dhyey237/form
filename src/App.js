import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5);
  const [editingStudentId, setEditingStudentId] = useState(null);

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

    if (editingStudentId !== null) {
      // Edit existing student
      const updatedStudents = students.map((student) =>
        student.id === editingStudentId
          ? { ...formData, pass, id: student.id }
          : student
      );
      setStudents(updatedStudents);
      setEditingStudentId(null);
    } else {
      // Add new student
      const newStudent = { ...formData, pass, id: generateId() };
      setStudents([...students, newStudent]);
    }

    // Clear the form after submission
    setFormData({
      name: "",
      email: "",
      phone: "",
      marks: "",
      pass: false,
    });
  };

  const handleEdit = (student) => {
    setFormData(student);
    setEditingStudentId(student.id);
  };

  const handleDelete = (student) => {
    const updatedStudents = students.filter((s) => s.id !== student.id);
    setStudents(updatedStudents);
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

  const generateId = () => {
    // Generate a random ID (for demonstration purposes)
    return Math.floor(Math.random() * 100000);
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
            <th>Actions</th>
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
              <td>
                <button
                  className="edit-button"
                  onClick={() => handleEdit(student)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(student)}
                >
                  Delete
                </button>
              </td>
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
        editingStudentId={editingStudentId}
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

const StudentForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  editingStudentId,
}) => {
  return (
    <div className="form-container">
      <h2 className="form-title">
        {editingStudentId ? "Edit Student" : "Create Student"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name:</label>
          <input
            className="form-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            className="form-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Phone:</label>
          <input
            className="form-input"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Marks:</label>
          <input
            className="form-input"
            type="text"
            name="marks"
            value={formData.marks}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Pass/Fail:</label>
          <input
            className="form-checkbox"
            type="checkbox"
            name="pass"
            checked={formData.pass}
            onChange={handleInputChange}
          />
        </div>
        <button className="form-button" type="submit">
          {editingStudentId ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default App;
