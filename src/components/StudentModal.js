
import React from "react";

export default function StudentModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  onChange,
  isEditing,
  message,
  messageType,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <section
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-modal-title"
      >
        <h2 id="student-modal-title">
          {isEditing ? "Edit Student" : "Register Student"}
        </h2>

        <form className="student-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="modal-fullName">Full Name</label>
            <input
              id="modal-fullName"
              name="fullName"
              value={form.fullName}
              onChange={onChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="modal-studentId">Student ID</label>
            <input
              id="modal-studentId"
              name="studentId"
              value={form.studentId}
              onChange={onChange}
              placeholder="Enter student ID"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="modal-email">Email Address</label>
            <input
              id="modal-email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="modal-status">Enrollment Status</label>
            <select
              id="modal-status"
              name="enrollmentStatus"
              value={form.enrollmentStatus}
              onChange={onChange}
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="modal-age">Age</label>
            <input
              id="modal-age"
              name="age"
              type="number"
              min="1"
              max="90"
              step="1"
              value={form.age}
              onChange={onChange}
              placeholder="Enter age"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="modal-course">Course</label>
            <input
              id="modal-course"
              name="course"
              value={form.course}
              onChange={onChange}
              placeholder="Enter course"
              required
            />
          </div>

          {message && (
            <div className={`message ${messageType}`} role="alert">
              {message}
            </div>
          )}

          <div className="modal-actions">
            <button type="submit" className="primary-button">
              {isEditing ? "Update Student" : "Register Student"}
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
