
import React, { useEffect, useMemo, useState } from "react";
import StudentModal from "./components/StudentModal";
import "./App.css";

const STORAGE_KEY = "students";

const emptyForm = {
  fullName: "",
  studentId: "",
  email: "",
  enrollmentStatus: "Active",
  age: "",
  course: "",
};

function loadStudents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.map((student, index) => ({
      id: student.id ?? `legacy-${index}-${student.studentId ?? ""}`,
      fullName: String(student.fullName ?? student.name ?? ""),
      studentId: String(student.studentId ?? ""),
      email: String(student.email ?? ""),
      enrollmentStatus:
        student.enrollmentStatus ?? student.status ?? "Active",
      age: student.age ?? "",
      course: String(student.course ?? ""),
    }));
  } catch {
    return [];
  }
}

export default function App() {
  const [students, setStudents] = useState(loadStudents);
  const [form, setForm] = useState({ ...emptyForm });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch {
      showMessage("Unable to save student records in this browser.", "error");
    }
  }, [students]);

  function showMessage(text, type = "success") {
    setMessage(text);
    setMessageType(type);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function openAddModal() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setMessage("");
    setIsModalOpen(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const fullName = form.fullName.trim();
    const studentId = form.studentId.trim();
    const email = form.email.trim();
    const course = form.course.trim();
    const ageText = String(form.age).trim();
    const age = Number(ageText);

    if (!fullName || !studentId || !email || !course || !ageText) {
      showMessage("Please fill in all fields.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }

    if (!Number.isInteger(age) || age < 1 || age > 90) {
      showMessage("Age must be a whole number between 1 and 90.", "error");
      return;
    }

    const duplicateId = students.some(
      (student) =>
        String(student.studentId).toLowerCase() === studentId.toLowerCase() &&
        student.id !== editingId
    );

    if (duplicateId) {
      showMessage("This Student ID is already in use.", "error");
      return;
    }

    const duplicateEmail = students.some(
      (student) =>
        String(student.email).toLowerCase() === email.toLowerCase() &&
        student.id !== editingId
    );

    if (duplicateEmail) {
      showMessage("This email address is already registered.", "error");
      return;
    }

    const studentData = {
      fullName,
      studentId,
      email,
      enrollmentStatus: form.enrollmentStatus,
      age,
      course,
    };

    if (editingId !== null) {
      setStudents((previous) =>
        previous.map((student) =>
          student.id === editingId
            ? { ...student, ...studentData }
            : student
        )
      );

      showMessage("Student updated successfully!");
    } else {
      setStudents((previous) => [
        ...previous,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          ...studentData,
        },
      ]);

      showMessage("Student registered successfully!");
    }

    setForm({ ...emptyForm });
    setEditingId(null);
    setIsModalOpen(false);
  }

  function handleEdit(student) {
    setForm({
      fullName: student.fullName,
      studentId: student.studentId,
      email: student.email,
      enrollmentStatus: student.enrollmentStatus,
      age: String(student.age),
      course: student.course,
    });

    setEditingId(student.id);
    setMessage("");
    setIsModalOpen(true);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setMessage("");
    setIsModalOpen(false);
  }

  function handleDelete(student) {
    setStudentToDelete(student);
  }

  function confirmDelete() {
    if (!studentToDelete) return;

    const deletedId = studentToDelete.id;

    setStudents((previous) =>
      previous.filter((student) => student.id !== deletedId)
    );

    if (editingId === deletedId) {
      setEditingId(null);
      setForm({ ...emptyForm });
      setIsModalOpen(false);
    }

    setStudentToDelete(null);
    showMessage("Student deleted successfully!");
  }

  const filteredStudents = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return students;

    return students.filter((student) =>
      [
        student.fullName,
        student.studentId,
        student.email,
        String(student.age),
        student.course,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(search)
      )
    );
  }, [students, searchTerm]);

  return (
    <main className="app-container">
      <section className="registration-panel">
        <header className="panel-heading">
          <h1>Student Management</h1>
          <p>Manage your student records below.</p>

          <button
            type="button"
            className="primary-button"
            onClick={openAddModal}
          >
            + Add Student
          </button>
        </header>

        {message && (
          <div
            className={`message ${messageType}`}
            role="status"
            aria-live="polite"
          >
            <span>{messageType === "success" ? "✓" : "!"}</span>{" "}
            {message}
          </div>
        )}
      </section>

      <section className="students-panel">
        <header className="students-heading">
          <h2>Registered Students</h2>
          <p>Total students: {students.length}</p>
        </header>

        <div className="search-wrapper">
          <input
            type="search"
            aria-label="Search students"
            placeholder="Search by name, ID, age or email..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="student-list">
          {filteredStudents.length === 0 ? (
            <div className="empty-state">
              <h3>
                {searchTerm.trim()
                  ? "No students found"
                  : "No students registered yet"}
              </h3>
              <p>
                {searchTerm.trim()
                  ? "Try another search."
                  : "Click Add Student to register your first student."}
              </p>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <article className="student-card" key={student.id}>
                <div className="student-card-header">
                  <h3>{student.fullName || "Unnamed Student"}</h3>

                  <span
                    className={`status-badge ${
                      student.enrollmentStatus === "Active"
                        ? "status-active"
                        : "status-inactive"
                    }`}
                  >
                    {student.enrollmentStatus}
                  </span>
                </div>

                <div className="student-id">
                  <strong>Student ID:</strong>{" "}
                  {student.studentId || "Not provided"}
                </div>

                <div className="student-details">
                  <p>
                    <strong>Age:</strong> {student.age || "—"}
                  </p>
                  <p>
                    <strong>Email:</strong> {student.email || "Not provided"}
                  </p>
                  <p>
                    <strong>Course:</strong> {student.course || "Not provided"}
                  </p>
                </div>

                <div className="student-actions">
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="update-button"
                    onClick={() => handleEdit(student)}
                  >
                    Update
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDelete(student)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <StudentModal
        isOpen={isModalOpen}
        onClose={handleCancelEdit}
        onSubmit={handleSubmit}
        form={form}
        onChange={handleChange}
        isEditing={editingId !== null}
        message={message}
        messageType={messageType}
      />

      {studentToDelete && (
        <div className="modal-overlay">
          <section
            className="modal-content delete-confirmation"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
          >
            <h2 id="delete-title">Confirm Delete</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>{studentToDelete.fullName}</strong>?
            </p>
            <p>This action cannot be undone.</p>

            <div className="modal-actions">
              <button
                type="button"
                className="delete-button"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={() => setStudentToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
