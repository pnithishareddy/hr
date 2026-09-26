import React, { useEffect, useMemo, useState } from "react";
import "./style.css";

const EMP_KEY = "hr_employees_v4";
const DEPT_KEY = "hr_departments_v4";
const LEAVE_KEY = "hr_leaves_v4";
const ATT_KEY = "hr_attendance_v4";
const PERF_KEY = "hr_performance_v4";

const initialEmployees = [
  {
    id: 1,
    name: "Sam",
    email: "sam@gmail.com",
    phone: "9876543210",
    birthday: "1998-05-15",
    joiningDate: "2024-06-10",
    salary: 65000,
    location: "Hyderabad",
    department: "Engineering",
    role: "Software Developer",
    status: "Active",
  },
  {
    id: 2,
    name: "Chay",
    email: "chay@gmail.com",
    phone: "9876543211",
    birthday: "1997-08-22",
    joiningDate: "2023-09-18",
    salary: 55000,
    location: "Hyderabad",
    department: "Human Resources",
    role: "HR Executive",
    status: "Active",
  },
  {
    id: 3,
    name: "Ntr",
    email: "ntr@gmail.com",
    phone: "9876543212",
    birthday: "1996-12-10",
    joiningDate: "2022-04-15",
    salary: 60000,
    location: "Hyderabad",
    department: "Finance",
    role: "Accountant",
    status: "Active",
  },
  {
    id: 4,
    name: "Mb",
    email: "mb@gmail.com",
    phone: "9876543213",
    birthday: "1999-03-28",
    joiningDate: "2024-01-08",
    salary: 62000,
    location: "Hyderabad",
    department: "Engineering",
    role: "UI Developer",
    status: "Active",
  },
  {
    id: 5,
    name: "Arjun",
    email: "arjun@gmail.com",
    phone: "9876543214",
    birthday: "1998-11-05",
    joiningDate: "2023-07-20",
    salary: 58000,
    location: "Hyderabad",
    department: "Finance",
    role: "Financial Analyst",
    status: "Active",
  },
];

const initialDepartments = [
  {
    id: 1,
    name: "Engineering",
    manager: "Sam",
    location: "Hyderabad",
  },
  {
    id: 2,
    name: "Human Resources",
    manager: "Chay",
    location: "Hyderabad",
  },
  {
    id: 3,
    name: "Finance",
    manager: "Ntr",
    location: "Hyderabad",
  },
];

const initialLeaves = [
  {
    id: 1,
    employeeId: 1,
    employee: "Sam",
    type: "Casual Leave",
    from: "2026-09-28",
    to: "2026-09-29",
    days: 2,
    reason: "Personal work",
    status: "Pending",
  },
  {
    id: 2,
    employeeId: 2,
    employee: "Chay",
    type: "Sick Leave",
    from: "2026-09-20",
    to: "2026-09-20",
    days: 1,
    reason: "Health reason",
    status: "Approved",
  },
  {
    id: 3,
    employeeId: 5,
    employee: "Arjun",
    type: "Casual Leave",
    from: "2026-09-15",
    to: "2026-09-16",
    days: 2,
    reason: "Family function",
    status: "Approved",
  },
];

const initialAttendance = [
  {
    id: 1,
    employee: "Sam",
    date: "2026-09-26",
    status: "Present",
  },
  {
    id: 2,
    employee: "Chay",
    date: "2026-09-26",
    status: "Present",
  },
  {
    id: 3,
    employee: "Ntr",
    date: "2026-09-26",
    status: "Present",
  },
  {
    id: 4,
    employee: "Mb",
    date: "2026-09-26",
    status: "Absent",
  },
  {
    id: 5,
    employee: "Arjun",
    date: "2026-09-26",
    status: "Present",
  },
];

const initialPerformance = [
  {
    id: 1,
    employee: "Sam",
    rating: 4.5,
    review: "Excellent",
  },
  {
    id: 2,
    employee: "Chay",
    rating: 4.2,
    review: "Very Good",
  },
  {
    id: 3,
    employee: "Ntr",
    rating: 4,
    review: "Good",
  },
  {
    id: 4,
    employee: "Mb",
    rating: 4.4,
    review: "Excellent",
  },
  {
    id: 5,
    employee: "Arjun",
    rating: 3.9,
    review: "Good",
  },
];

function readData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);

    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    return fallback;
  }

  return fallback;
}

function writeData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function formatDate(date) {
  if (!date) return "-";

  const value = new Date(`${date}T00:00:00`);

  if (Number.isNaN(value.getTime())) {
    return date;
  }

  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getInitials(name) {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function calculateLeaveDays(from, to) {
  if (!from || !to) return 0;

  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);

  if (end < start) return 0;

  return (
    Math.floor(
      (end.getTime() - start.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1
  );
}

/* =========================
   TOAST
========================= */

function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`}>
      <div>
        <strong>{toast.title}</strong>
        <span>{toast.message}</span>
      </div>

      <button onClick={onClose}>×</button>
    </div>
  );
}

/* =========================
   MODAL
========================= */

function Modal({ title, children, onClose, large = false }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal ${large ? "modal-large" : ""}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

/* =========================
   EMPLOYEE PROFILE
========================= */

function EmployeeProfile({
  employee,
  onClose,
  onEdit,
}) {
  if (!employee) return null;

  return (
    <Modal
      title="Employee Profile"
      onClose={onClose}
      large
    >
      <div className="profile-header">
        <div className="profile-avatar">
          {getInitials(employee.name)}
        </div>

        <div>
          <h2>{employee.name}</h2>
          <p>{employee.role}</p>
          <span className="status active">
            {employee.status}
          </span>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-item">
          <span>Email</span>
          <strong>{employee.email}</strong>
        </div>

        <div className="profile-item">
          <span>Phone</span>
          <strong>{employee.phone}</strong>
        </div>

        <div className="profile-item">
          <span>Department</span>
          <strong>{employee.department}</strong>
        </div>

        <div className="profile-item">
          <span>Job Role</span>
          <strong>{employee.role}</strong>
        </div>

        <div className="profile-item">
          <span>Salary</span>
          <strong>
            ₹{Number(employee.salary).toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="profile-item">
          <span>Location</span>
          <strong>{employee.location}</strong>
        </div>

        <div className="profile-item">
          <span>Birthday</span>
          <strong>{formatDate(employee.birthday)}</strong>
        </div>

        <div className="profile-item">
          <span>Date of Joining</span>
          <strong>
            {formatDate(employee.joiningDate)}
          </strong>
        </div>
      </div>

      <div className="modal-actions">
        <button
          className="secondary-button"
          onClick={onClose}
        >
          Close
        </button>

        <button
          className="primary-button"
          onClick={() => onEdit(employee)}
        >
          Edit Employee
        </button>
      </div>
    </Modal>
  );
}

/* =========================
   EMPLOYEE FORM
========================= */

function EmployeeForm({
  initialData,
  departments,
  onSubmit,
  onCancel,
}) {
  const editing = Boolean(initialData);

  const [form, setForm] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    birthday: initialData?.birthday || "",
    joiningDate: initialData?.joiningDate || "",
    salary: initialData?.salary || "",
    location: initialData?.location || "Hyderabad",
    department:
      initialData?.department ||
      departments[0]?.name ||
      "",
    role: initialData?.role || "",
    status: initialData?.status || "Active",
  });

  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  }

  function validate() {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (
      !form.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      nextErrors.email = "Enter a valid email";
    }

    if (
      !/^[0-9]{10}$/.test(form.phone)
    ) {
      nextErrors.phone =
        "Phone must contain 10 digits";
    }

    if (!form.birthday) {
      nextErrors.birthday =
        "Birthday is required";
    }

    if (!form.joiningDate) {
      nextErrors.joiningDate =
        "Joining date is required";
    }

    if (
      !form.salary ||
      Number(form.salary) <= 0
    ) {
      nextErrors.salary =
        "Enter a valid salary";
    }

    if (!form.location.trim()) {
      nextErrors.location =
        "Location is required";
    }

    if (!form.department) {
      nextErrors.department =
        "Select department";
    }

    if (!form.role.trim()) {
      nextErrors.role =
        "Job role is required";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) return;

    onSubmit({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      salary: Number(form.salary),
      location: form.location.trim(),
      role: form.role.trim(),
    });
  }

  return (
    <form
      className="form-layout"
      onSubmit={handleSubmit}
    >
      <div className="form-grid">
        <FormField
          label="Employee Name"
          value={form.name}
          error={errors.name}
          onChange={(value) =>
            updateField("name", value)
          }
          placeholder="Enter employee name"
        />

        <FormField
          label="Email"
          type="email"
          value={form.email}
          error={errors.email}
          onChange={(value) =>
            updateField("email", value)
          }
          placeholder="Enter email"
        />

        <FormField
          label="Phone Number"
          value={form.phone}
          error={errors.phone}
          onChange={(value) =>
            updateField(
              "phone",
              value.replace(/\D/g, "")
            )
          }
          placeholder="10 digit phone number"
          maxLength="10"
        />

        <FormField
          label="Birthday"
          type="date"
          value={form.birthday}
          error={errors.birthday}
          onChange={(value) =>
            updateField("birthday", value)
          }
        />

        <FormField
          label="Date of Joining"
          type="date"
          value={form.joiningDate}
          error={errors.joiningDate}
          onChange={(value) =>
            updateField(
              "joiningDate",
              value
            )
          }
        />

        <FormField
          label="Salary"
          type="number"
          value={form.salary}
          error={errors.salary}
          onChange={(value) =>
            updateField("salary", value)
          }
          placeholder="Enter salary"
        />

        <FormField
          label="Location"
          value={form.location}
          error={errors.location}
          onChange={(value) =>
            updateField("location", value)
          }
          placeholder="Enter location"
        />

        <div className="form-field">
          <label>Department</label>

          <select
            value={form.department}
            onChange={(event) =>
              updateField(
                "department",
                event.target.value
              )
            }
          >
            <option value="">
              Select Department
            </option>

            {departments.map((department) => (
              <option
                key={department.id}
                value={department.name}
              >
                {department.name}
              </option>
            ))}
          </select>

          {errors.department && (
            <small className="field-error">
              {errors.department}
            </small>
          )}
        </div>

        <FormField
          label="Job Role"
          value={form.role}
          error={errors.role}
          onChange={(value) =>
            updateField("role", value)
          }
          placeholder="Enter job role"
        />

        {editing && (
          <div className="form-field">
            <label>Status</label>

            <select
              value={form.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value
                )
              }
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>
        )}
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary-button"
        >
          {editing
            ? "Save Changes"
            : "Add Employee"}
        </button>
      </div>
    </form>
  );
}

function FormField({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  maxLength,
}) {
  return (
    <div className="form-field">
      <label>{label}</label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />

      {error && (
        <small className="field-error">
          {error}
        </small>
      )}
    </div>
  );
}

/* =========================
   DASHBOARD
========================= */

function Dashboard({
  employees,
  departments,
  leaves,
  attendance,
  onNavigate,
  onEmployeeClick,
}) {
  const activeEmployees = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "Pending"
  );

  const today = getToday();

  const todayAttendance = attendance.filter(
    (item) => item.date === today
  );

  const present = todayAttendance.filter(
    (item) => item.status === "Present"
  ).length;

  const attendancePercentage =
    employees.length === 0
      ? 0
      : Math.round(
          (present / employees.length) * 100
        );

  const recentEmployees = [...employees]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  return (
    <div className="page-container">
      <div className="page-header dashboard-heading">
        <div>
          <span className="eyebrow">
            OVERVIEW
          </span>

          <h1>HR Dashboard</h1>

          <p>
            Manage your workforce from one place.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => onNavigate("employees")}
        >
          + Add Employee
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          icon="👥"
          title="Total Employees"
          value={employees.length}
          className="purple"
        />

        <StatCard
          icon="✓"
          title="Active Employees"
          value={activeEmployees}
          className="green"
        />

        <StatCard
          icon="📊"
          title="Today's Attendance"
          value={`${attendancePercentage}%`}
          className="teal"
        />

        <StatCard
          icon="📝"
          title="Pending Leaves"
          value={pendingLeaves.length}
          className="orange"
        />
      </div>

      <div className="dashboard-grid">
        <section className="card">
          <CardHeader
            title="Department Overview"
            subtitle="Employees by department"
          />

          <div className="department-list">
            {departments.length === 0 ? (
              <EmptyState text="No departments available." />
            ) : (
              departments.map((department) => {
                const count = employees.filter(
                  (employee) =>
                    employee.department ===
                    department.name
                ).length;

                const percentage =
                  employees.length === 0
                    ? 0
                    : Math.round(
                        (count /
                          employees.length) *
                          100
                      );

                return (
                  <div
                    className="department-row"
                    key={department.id}
                  >
                    <div className="department-row-top">
                      <div>
                        <strong>
                          {department.name}
                        </strong>

                        <span>
                          Manager:{" "}
                          {department.manager ||
                            "Not assigned"}
                        </span>
                      </div>

                      <b>{count}</b>
                    </div>

                    <div className="progress">
                      <span
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <div className="department-footer">
                      <span>
                        {percentage}% of workforce
                      </span>

                      <span>
                        {department.location}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="card">
          <CardHeader
            title="Pending Leave Requests"
            subtitle="Requests waiting for approval"
          />

          {pendingLeaves.length === 0 ? (
            <EmptyState text="No pending leave requests." />
          ) : (
            <div className="pending-list">
              {pendingLeaves.slice(0, 4).map((leave) => (
                <div
                  className="pending-item"
                  key={leave.id}
                >
                  <div>
                    <strong>{leave.employee}</strong>
                    <span>{leave.type}</span>
                    <small>
                      {formatDate(leave.from)} -{" "}
                      {formatDate(leave.to)}
                    </small>
                  </div>

                  <button
                    className="small-button"
                    onClick={() =>
                      onNavigate("leaves")
                    }
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            className="outline-button full-width"
            onClick={() => onNavigate("leaves")}
          >
            View All Leaves
          </button>
        </section>
      </div>

      <div className="dashboard-grid bottom-grid">
        <section className="card">
          <CardHeader
            title="Today's Attendance"
            subtitle="Attendance summary"
          />

          <div className="attendance-summary">
            <div
              className="attendance-ring"
              style={{
                background: `conic-gradient(
                  #14b8a6 0deg,
                  #14b8a6 ${
                    attendancePercentage * 3.6
                  }deg,
                  #e2e8f0 ${
                    attendancePercentage * 3.6
                  }deg,
                  #e2e8f0 360deg
                )`,
              }}
            >
              <div>
                <strong>
                  {attendancePercentage}%
                </strong>

                <span>Present</span>
              </div>
            </div>

            <div className="attendance-numbers">
              <div>
                <span className="dot green-dot" />
                Present
                <b>{present}</b>
              </div>

              <div>
                <span className="dot red-dot" />
                Absent
                <b>
                  {Math.max(
                    employees.length - present,
                    0
                  )}
                </b>
              </div>

              <div>
                <span className="dot blue-dot" />
                Total
                <b>{employees.length}</b>
              </div>
            </div>
          </div>
        </section>

        <section className="card">
          <CardHeader
            title="Recent Employees"
            subtitle="Recently added employees"
          />

          {recentEmployees.length === 0 ? (
            <EmptyState text="No employees available." />
          ) : (
            <div className="recent-list">
              {recentEmployees.map((employee) => (
                <button
                  className="recent-item"
                  key={employee.id}
                  onClick={() =>
                    onEmployeeClick(employee)
                  }
                >
                  <div className="avatar">
                    {getInitials(employee.name)}
                  </div>

                  <div>
                    <strong>{employee.name}</strong>
                    <span>{employee.role}</span>
                  </div>

                  <span className="status active">
                    {employee.status}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  className,
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${className}`}>
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function CardHeader({ title, subtitle, action }) {
  return (
    <div className="card-header">
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      {action}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">⌁</div>
      <strong>{text}</strong>
    </div>
  );
}

/* =========================
   EMPLOYEES
========================= */

function EmployeesPage({
  employees,
  departments,
  onAdd,
  onEdit,
  onDelete,
  onView,
}) {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] =
    useState("asc");
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const pageSize = 4;

  const filteredEmployees = useMemo(() => {
    let result = employees.filter((employee) => {
      const searchValue = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !searchValue ||
        employee.name
          .toLowerCase()
          .includes(searchValue) ||
        employee.email
          .toLowerCase()
          .includes(searchValue) ||
        employee.role
          .toLowerCase()
          .includes(searchValue) ||
        employee.department
          .toLowerCase()
          .includes(searchValue);

      const matchesDepartment =
        departmentFilter === "All" ||
        employee.department ===
          departmentFilter;

      const matchesStatus =
        statusFilter === "All" ||
        employee.status === statusFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });

    result.sort((a, b) => {
      let first = a[sortBy];
      let second = b[sortBy];

      if (sortBy === "salary") {
        first = Number(first);
        second = Number(second);
      } else {
        first = String(first).toLowerCase();
        second = String(second).toLowerCase();
      }

      if (first < second) {
        return sortDirection === "asc" ? -1 : 1;
      }

      if (first > second) {
        return sortDirection === "asc" ? 1 : -1;
      }

      return 0;
    });

    return result;
  }, [
    employees,
    search,
    departmentFilter,
    statusFilter,
    sortBy,
    sortDirection,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredEmployees.length / pageSize
    )
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedEmployees =
    filteredEmployees.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

  function changeSort(value) {
    if (sortBy === value) {
      setSortDirection((previous) =>
        previous === "asc" ? "desc" : "asc"
      );
    } else {
      setSortBy(value);
      setSortDirection("asc");
    }

    setPage(1);
  }

  function resetFilters() {
    setSearch("");
    setDepartmentFilter("All");
    setStatusFilter("All");
    setSortBy("name");
    setSortDirection("asc");
    setPage(1);
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            PEOPLE MANAGEMENT
          </span>

          <h1>Employees</h1>

          <p>
            Add, edit, search and manage employees.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowAdd(true)}
        >
          + Add Employee
        </button>
      </div>

      <div className="card">
        <div className="filters">
          <input
            className="search-box"
            placeholder="Search by name, email, role..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />

          <select
            value={departmentFilter}
            onChange={(event) => {
              setDepartmentFilter(
                event.target.value
              );
              setPage(1);
            }}
          >
            <option value="All">
              All Departments
            </option>

            {departments.map((department) => (
              <option
                key={department.id}
                value={department.name}
              >
                {department.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(
                event.target.value
              );
              setPage(1);
            }}
          >
            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>

          <button
            className="outline-button"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>

        <div className="sort-row">
          <span>Sort by:</span>

          <button
            className={
              sortBy === "name"
                ? "sort-active"
                : ""
            }
            onClick={() => changeSort("name")}
          >
            Name{" "}
            {sortBy === "name" &&
              (sortDirection === "asc"
                ? "↑"
                : "↓")}
          </button>

          <button
            className={
              sortBy === "department"
                ? "sort-active"
                : ""
            }
            onClick={() =>
              changeSort("department")
            }
          >
            Department{" "}
            {sortBy === "department" &&
              (sortDirection === "asc"
                ? "↑"
                : "↓")}
          </button>

          <button
            className={
              sortBy === "salary"
                ? "sort-active"
                : ""
            }
            onClick={() =>
              changeSort("salary")
            }
          >
            Salary{" "}
            {sortBy === "salary" &&
              (sortDirection === "asc"
                ? "↑"
                : "↓")}
          </button>
        </div>

        {paginatedEmployees.length === 0 ? (
          <EmptyState text="No employees found." />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedEmployees.map(
                  (employee) => (
                    <tr key={employee.id}>
                      <td>
                        <button
                          className="employee-cell"
                          onClick={() =>
                            onView(employee)
                          }
                        >
                          <div className="avatar">
                            {getInitials(
                              employee.name
                            )}
                          </div>

                          <strong>
                            {employee.name}
                          </strong>
                        </button>
                      </td>

                      <td>{employee.email}</td>

                      <td>{employee.department}</td>

                      <td>{employee.role}</td>

                      <td>
                        ₹
                        {Number(
                          employee.salary
                        ).toLocaleString("en-IN")}
                      </td>

                      <td>
                        <span
                          className={`status ${
                            employee.status ===
                            "Active"
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            className="view-button"
                            onClick={() =>
                              onView(employee)
                            }
                          >
                            View
                          </button>

                          <button
                            className="edit-button"
                            onClick={() =>
                              onEdit(employee)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              onDelete(employee)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          total={filteredEmployees.length}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </div>

      {showAdd && (
        <Modal
          title="Add New Employee"
          onClose={() => setShowAdd(false)}
          large
        >
          <EmployeeForm
            departments={departments}
            onSubmit={(data) => {
              onAdd(data);
              setShowAdd(false);
            }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}) {
  if (total === 0) return null;

  const start =
    (page - 1) * pageSize + 1;

  const end = Math.min(
    page * pageSize,
    total
  );

  return (
    <div className="pagination">
      <span>
        Showing {start}-{end} of {total}
      </span>

      <div>
        <button
          disabled={page === 1}
          onClick={() =>
            onPageChange(page - 1)
          }
        >
          Previous
        </button>

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((number) => (
          <button
            key={number}
            className={
              page === number
                ? "page-active"
                : ""
            }
            onClick={() =>
              onPageChange(number)
            }
          >
            {number}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() =>
            onPageChange(page + 1)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* =========================
   ATTENDANCE
========================= */

function AttendancePage({
  employees,
  attendance,
  onChange,
}) {
  const [date, setDate] = useState(getToday());
  const [search, setSearch] = useState("");

  const visibleEmployees = employees.filter(
    (employee) =>
      employee.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  function getStatus(employeeName) {
    const record = attendance.find(
      (item) =>
        item.employee === employeeName &&
        item.date === date
    );

    return record?.status || "Present";
  }

  const presentCount = employees.filter(
    (employee) =>
      getStatus(employee.name) === "Present"
  ).length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            TIME MANAGEMENT
          </span>

          <h1>Attendance</h1>

          <p>
            Mark and manage employee attendance.
          </p>
        </div>
      </div>

      <div className="card attendance-toolbar">
        <input
          type="date"
          value={date}
          onChange={(event) =>
            setDate(event.target.value)
          }
        />

        <input
          className="search-box"
          placeholder="Search employee..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <div className="attendance-count">
          Present:{" "}
          <strong>
            {presentCount}/{employees.length}
          </strong>
        </div>
      </div>

      {visibleEmployees.length === 0 ? (
        <EmptyState text="No employees found." />
      ) : (
        <div className="attendance-grid">
          {visibleEmployees.map((employee) => {
            const status = getStatus(
              employee.name
            );

            return (
              <div
                className="attendance-card"
                key={employee.id}
              >
                <div className="attendance-employee">
                  <div className="avatar">
                    {getInitials(employee.name)}
                  </div>

                  <div>
                    <strong>
                      {employee.name}
                    </strong>

                    <span>
                      {employee.role}
                    </span>
                  </div>
                </div>

                <div className="attendance-buttons">
                  <button
                    className={
                      status === "Present"
                        ? "attendance-present selected"
                        : "attendance-present"
                    }
                    onClick={() =>
                      onChange(
                        employee.name,
                        date,
                        "Present"
                      )
                    }
                  >
                    ✓ Present
                  </button>

                  <button
                    className={
                      status === "Absent"
                        ? "attendance-absent selected"
                        : "attendance-absent"
                    }
                    onClick={() =>
                      onChange(
                        employee.name,
                        date,
                        "Absent"
                      )
                    }
                  >
                    × Absent
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =========================
   LEAVES
========================= */

function LeavesPage({
  leaves,
  employees,
  onApply,
  onStatusChange,
}) {
  const [filter, setFilter] = useState("All");
  const [showApply, setShowApply] =
    useState(false);

  const filteredLeaves =
    filter === "All"
      ? leaves
      : leaves.filter(
          (leave) =>
            leave.status === filter
        );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            TIME OFF
          </span>

          <h1>Leave Management</h1>

          <p>
            Apply, review and manage employee leaves.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowApply(true)}
        >
          + Apply Leave
        </button>
      </div>

      <div className="leave-summary">
        <MiniSummary
          title="Total"
          value={leaves.length}
        />

        <MiniSummary
          title="Pending"
          value={
            leaves.filter(
              (leave) =>
                leave.status === "Pending"
            ).length
          }
        />

        <MiniSummary
          title="Approved"
          value={
            leaves.filter(
              (leave) =>
                leave.status === "Approved"
            ).length
          }
        />

        <MiniSummary
          title="Rejected"
          value={
            leaves.filter(
              (leave) =>
                leave.status === "Rejected"
            ).length
          }
        />
      </div>

      <div className="filter-tabs">
        {[
          "All",
          "Pending",
          "Approved",
          "Rejected",
        ].map((item) => (
          <button
            key={item}
            className={
              filter === item
                ? "filter-active"
                : ""
            }
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {filteredLeaves.length === 0 ? (
        <EmptyState text="No leave history found." />
      ) : (
        <div className="leave-grid">
          {filteredLeaves.map((leave) => (
            <div
              className="leave-card"
              key={leave.id}
            >
              <div className="leave-card-header">
                <div className="avatar">
                  {getInitials(
                    leave.employee
                  )}
                </div>

                <div>
                  <h3>{leave.employee}</h3>
                  <span>{leave.type}</span>
                </div>

                <span
                  className={`status ${leave.status.toLowerCase()}`}
                >
                  {leave.status}
                </span>
              </div>

              <div className="leave-info-grid">
                <div>
                  <span>From</span>
                  <strong>
                    {formatDate(leave.from)}
                  </strong>
                </div>

                <div>
                  <span>To</span>
                  <strong>
                    {formatDate(leave.to)}
                  </strong>
                </div>

                <div>
                  <span>Days</span>
                  <strong>{leave.days}</strong>
                </div>
              </div>

              <div className="leave-reason">
                <span>Reason</span>
                <p>
                  {leave.reason || "No reason provided"}
                </p>
              </div>

              {leave.status === "Pending" && (
                <div className="leave-actions">
                  <button
                    className="approve-button"
                    onClick={() =>
                      onStatusChange(
                        leave.id,
                        "Approved"
                      )
                    }
                  >
                    Approve
                  </button>

                  <button
                    className="reject-button"
                    onClick={() =>
                      onStatusChange(
                        leave.id,
                        "Rejected"
                      )
                    }
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showApply && (
        <Modal
          title="Apply Leave"
          onClose={() => setShowApply(false)}
        >
          <LeaveForm
            employees={employees}
            onSubmit={(data) => {
              onApply(data);
              setShowApply(false);
            }}
            onCancel={() => setShowApply(false)}
          />
        </Modal>
      )}
    </div>
  );
}

function MiniSummary({ title, value }) {
  return (
    <div className="mini-summary">
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}

function LeaveForm({
  employees,
  onSubmit,
  onCancel,
}) {
  const [employeeId, setEmployeeId] =
    useState(employees[0]?.id || "");
  const [type, setType] =
    useState("Casual Leave");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !employeeId ||
      !type ||
      !from ||
      !to ||
      !reason.trim()
    ) {
      setError(
        "Please fill all leave details."
      );
      return;
    }

    if (to < from) {
      setError(
        "To date cannot be before From date."
      );
      return;
    }

    const employee = employees.find(
      (item) =>
        item.id === Number(employeeId)
    );

    if (!employee) {
      setError("Employee not found.");
      return;
    }

    onSubmit({
      employeeId: employee.id,
      employee: employee.name,
      type,
      from,
      to,
      days: calculateLeaveDays(
        from,
        to
      ),
      reason: reason.trim(),
      status: "Pending",
    });
  }

  return (
    <form
      className="form-layout"
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <div className="form-field">
        <label>Employee</label>

        <select
          value={employeeId}
          onChange={(event) =>
            setEmployeeId(event.target.value)
          }
        >
          {employees.map((employee) => (
            <option
              key={employee.id}
              value={employee.id}
            >
              {employee.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>Leave Type</label>

        <select
          value={type}
          onChange={(event) =>
            setType(event.target.value)
          }
        >
          <option>Casual Leave</option>
          <option>Sick Leave</option>
          <option>Annual Leave</option>
          <option>Emergency Leave</option>
        </select>
      </div>

      <div className="form-grid">
        <FormField
          label="From Date"
          type="date"
          value={from}
          onChange={setFrom}
        />

        <FormField
          label="To Date"
          type="date"
          value={to}
          onChange={setTo}
        />
      </div>

      <div className="form-field">
        <label>Reason</label>

        <textarea
          value={reason}
          placeholder="Enter reason for leave"
          onChange={(event) =>
            setReason(event.target.value)
          }
          rows="4"
        />
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          className="primary-button"
          type="submit"
        >
          Apply Leave
        </button>
      </div>
    </form>
  );
}

/* =========================
   DEPARTMENTS
========================= */

function DepartmentsPage({
  departments,
  employees,
  onAdd,
  onEdit,
  onDelete,
  onEmployeeClick,
}) {
  const [showForm, setShowForm] =
    useState(false);
  const [editing, setEditing] =
    useState(null);

  function openAdd() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(department) {
    setEditing(department);
    setShowForm(true);
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            ORGANIZATION
          </span>

          <h1>Departments</h1>

          <p>
            Create and manage company departments.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openAdd}
        >
          + Add Department
        </button>
      </div>

      {departments.length === 0 ? (
        <EmptyState text="No departments available." />
      ) : (
        <div className="department-grid">
          {departments.map((department) => {
            const departmentEmployees =
              employees.filter(
                (employee) =>
                  employee.department ===
                  department.name
              );

            return (
              <div
                className="department-card"
                key={department.id}
              >
                <div className="department-card-top">
                  <div className="department-large-icon">
                    {department.name.charAt(0)}
                  </div>

                  <div className="department-card-actions">
                    <button
                      className="icon-button"
                      onClick={() =>
                        openEdit(department)
                      }
                    >
                      ✎
                    </button>

                    <button
                      className="icon-button danger"
                      onClick={() =>
                        onDelete(department)
                      }
                    >
                      ×
                    </button>
                  </div>
                </div>

                <h2>{department.name}</h2>

                <p>
                  Manager:{" "}
                  <strong>
                    {department.manager ||
                      "Not assigned"}
                  </strong>
                </p>

                <div className="department-meta">
                  <span>
                    📍 {department.location}
                  </span>

                  <span>
                    👥{" "}
                    {departmentEmployees.length}{" "}
                    employees
                  </span>
                </div>

                <div className="department-members">
                  {departmentEmployees.length ===
                  0 ? (
                    <span>
                      No employees
                    </span>
                  ) : (
                    departmentEmployees.map(
                      (employee) => (
                        <button
                          key={employee.id}
                          onClick={() =>
                            onEmployeeClick(
                              employee
                            )
                          }
                        >
                          {getInitials(
                            employee.name
                          )}{" "}
                          {employee.name}
                        </button>
                      )
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <Modal
          title={
            editing
              ? "Edit Department"
              : "Add Department"
          }
          onClose={() =>
            setShowForm(false)
          }
        >
          <DepartmentForm
            initialData={editing}
            onSubmit={(data) => {
              if (editing) {
                onEdit({
                  ...editing,
                  ...data,
                });
              } else {
                onAdd(data);
              }

              setShowForm(false);
            }}
            onCancel={() =>
              setShowForm(false)
            }
          />
        </Modal>
      )}
    </div>
  );
}

function DepartmentForm({
  initialData,
  onSubmit,
  onCancel,
}) {
  const [name, setName] = useState(
    initialData?.name || ""
  );
  const [manager, setManager] =
    useState(initialData?.manager || "");
  const [location, setLocation] =
    useState(initialData?.location || "");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !name.trim() ||
      !manager.trim() ||
      !location.trim()
    ) {
      setError(
        "Please fill all department details."
      );
      return;
    }

    onSubmit({
      name: name.trim(),
      manager: manager.trim(),
      location: location.trim(),
    });
  }

  return (
    <form
      className="form-layout"
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <FormField
        label="Department Name"
        value={name}
        onChange={setName}
        placeholder="Engineering"
      />

      <FormField
        label="Manager"
        value={manager}
        onChange={setManager}
        placeholder="Manager name"
      />

      <FormField
        label="Location"
        value={location}
        onChange={setLocation}
        placeholder="Hyderabad"
      />

      <div className="modal-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          className="primary-button"
          type="submit"
        >
          {initialData
            ? "Save Changes"
            : "Add Department"}
        </button>
      </div>
    </form>
  );
}

/* =========================
   PERFORMANCE
========================= */

function PerformancePage({ performance }) {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            EMPLOYEE DEVELOPMENT
          </span>

          <h1>Performance</h1>

          <p>
            Employee ratings and performance reviews.
          </p>
        </div>
      </div>

      {performance.length === 0 ? (
        <EmptyState text="No performance records available." />
      ) : (
        <div className="performance-grid">
          {performance.map((item) => (
            <div
              className="performance-card"
              key={item.id}
            >
              <div className="performance-header">
                <div className="avatar">
                  {getInitials(item.employee)}
                </div>

                <div>
                  <h3>{item.employee}</h3>
                  <p>{item.review}</p>
                </div>
              </div>

              <div className="rating-row">
                <div className="stars">
                  {"★".repeat(
                    Math.round(item.rating)
                  )}
                  {"☆".repeat(
                    5 - Math.round(item.rating)
                  )}
                </div>

                <strong>
                  {item.rating}/5
                </strong>
              </div>

              <div className="rating-bar">
                <span
                  style={{
                    width: `${
                      (item.rating / 5) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================
   APP
========================= */

function App() {
  const [employees, setEmployees] =
    useState([]);
  const [departments, setDepartments] =
    useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] =
    useState([]);
  const [performance, setPerformance] =
    useState([]);

  const [activePage, setActivePage] =
    useState("dashboard");

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [editingEmployee, setEditingEmployee] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [toast, setToast] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setEmployees(
          readData(
            EMP_KEY,
            initialEmployees
          )
        );

        setDepartments(
          readData(
            DEPT_KEY,
            initialDepartments
          )
        );

        setLeaves(
          readData(
            LEAVE_KEY,
            initialLeaves
          )
        );

        setAttendance(
          readData(
            ATT_KEY,
            initialAttendance
          )
        );

        setPerformance(
          readData(
            PERF_KEY,
            initialPerformance
          )
        );

        setLoading(false);
      } catch {
        setError(
          "Unable to load HR dashboard data."
        );
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!writeData(EMP_KEY, employees)) {
        setError(
          "Unable to save employee data."
        );
      }
    }
  }, [employees, loading]);

  useEffect(() => {
    if (!loading) {
      if (
        !writeData(
          DEPT_KEY,
          departments
        )
      ) {
        setError(
          "Unable to save department data."
        );
      }
    }
  }, [departments, loading]);

  useEffect(() => {
    if (!loading) {
      if (!writeData(LEAVE_KEY, leaves)) {
        setError(
          "Unable to save leave data."
        );
      }
    }
  }, [leaves, loading]);

  useEffect(() => {
    if (!loading) {
      if (
        !writeData(
          ATT_KEY,
          attendance
        )
      ) {
        setError(
          "Unable to save attendance data."
        );
      }
    }
  }, [attendance, loading]);

  useEffect(() => {
    if (!loading) {
      if (
        !writeData(
          PERF_KEY,
          performance
        )
      ) {
        setError(
          "Unable to save performance data."
        );
      }
    }
  }, [performance, loading]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast]);

  const pendingLeaves = useMemo(
    () =>
      leaves.filter(
        (leave) =>
          leave.status === "Pending"
      ),
    [leaves]
  );

  function showToast(
    message,
    type = "success",
    title = "Success"
  ) {
    setToast({
      message,
      type,
      title,
    });
  }

  function navigate(page) {
    setActivePage(page);
  }

  function addEmployee(data) {
    const id =
      employees.length > 0
        ? Math.max(
            ...employees.map(
              (employee) => employee.id
            )
          ) + 1
        : 1;

    setEmployees((previous) => [
      ...previous,
      {
        id,
        ...data,
      },
    ]);

    showToast(
      "Employee added successfully."
    );
  }

  function updateEmployee(data) {
    setEmployees((previous) =>
      previous.map((employee) =>
        employee.id === data.id
          ? data
          : employee
      )
    );

    setEditingEmployee(null);
    setSelectedEmployee(null);

    showToast(
      "Employee updated successfully."
    );
  }

  function deleteEmployee(employee) {
    const confirmed =
      window.confirm(
        `Delete ${employee.name}?`
      );

    if (!confirmed) return;

    setEmployees((previous) =>
      previous.filter(
        (item) => item.id !== employee.id
      )
    );

    setSelectedEmployee(null);

    showToast(
      "Employee deleted successfully.",
      "success"
    );
  }

  function addDepartment(data) {
    const duplicate =
      departments.some(
        (department) =>
          department.name.toLowerCase() ===
          data.name.toLowerCase()
      );

    if (duplicate) {
      showToast(
        "Department already exists.",
        "error",
        "Error"
      );
      return;
    }

    const id =
      departments.length > 0
        ? Math.max(
            ...departments.map(
              (department) =>
                department.id
            )
          ) + 1
        : 1;

    setDepartments((previous) => [
      ...previous,
      {
        id,
        ...data,
      },
    ]);

    showToast(
      "Department added successfully."
    );
  }

  function updateDepartment(data) {
    setDepartments((previous) =>
      previous.map((department) =>
        department.id === data.id
          ? data
          : department
      )
    );

    showToast(
      "Department updated successfully."
    );
  }

  function deleteDepartment(department) {
    const used = employees.some(
      (employee) =>
        employee.department ===
        department.name
    );

    if (used) {
      showToast(
        "This department has employees and cannot be deleted.",
        "error",
        "Cannot Delete"
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete ${department.name}?`
      );

    if (!confirmed) return;

    setDepartments((previous) =>
      previous.filter(
        (item) =>
          item.id !== department.id
      )
    );

    showToast(
      "Department deleted successfully."
    );
  }

  function changeAttendance(
    employeeName,
    date,
    status
  ) {
    setAttendance((previous) => {
      const existing = previous.find(
        (item) =>
          item.employee ===
            employeeName &&
          item.date === date
      );

      if (existing) {
        return previous.map((item) =>
          item.id === existing.id
            ? {
                ...item,
                status,
              }
            : item
        );
      }

      const id =
        previous.length > 0
          ? Math.max(
              ...previous.map(
                (item) => item.id
              )
            ) + 1
          : 1;

      return [
        ...previous,
        {
          id,
          employee: employeeName,
          date,
          status,
        },
      ];
    });

    showToast(
      `${employeeName} marked ${status}.`
    );
  }

  function applyLeave(data) {
    const id =
      leaves.length > 0
        ? Math.max(
            ...leaves.map(
              (leave) => leave.id
            )
          ) + 1
        : 1;

    setLeaves((previous) => [
      ...previous,
      {
        id,
        ...data,
      },
    ]);

    showToast(
      "Leave applied successfully."
    );
  }

  function changeLeaveStatus(id, status) {
    setLeaves((previous) =>
      previous.map((leave) =>
        leave.id === id
          ? {
              ...leave,
              status,
            }
          : leave
      )
    );

    showToast(
      `Leave ${status.toLowerCase()} successfully.`
    );
  }

  function renderPage() {
    switch (activePage) {
      case "employees":
        return (
          <EmployeesPage
            employees={employees}
            departments={departments}
            onAdd={addEmployee}
            onEdit={setEditingEmployee}
            onDelete={deleteEmployee}
            onView={setSelectedEmployee}
          />
        );

      case "attendance":
        return (
          <AttendancePage
            employees={employees}
            attendance={attendance}
            onChange={changeAttendance}
          />
        );

      case "leaves":
        return (
          <LeavesPage
            leaves={leaves}
            employees={employees}
            onApply={applyLeave}
            onStatusChange={
              changeLeaveStatus
            }
          />
        );

      case "departments":
        return (
          <DepartmentsPage
            departments={departments}
            employees={employees}
            onAdd={addDepartment}
            onEdit={updateDepartment}
            onDelete={deleteDepartment}
            onEmployeeClick={
              setSelectedEmployee
            }
          />
        );

      case "performance":
        return (
          <PerformancePage
            performance={performance}
          />
        );

      default:
        return (
          <Dashboard
            employees={employees}
            departments={departments}
            leaves={leaves}
            attendance={attendance}
            onNavigate={navigate}
            onEmployeeClick={
              setSelectedEmployee
            }
          />
        );
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">HR</div>

        <div className="spinner"></div>

        <h2>Loading HR Dashboard</h2>

        <p>
          Preparing employee management system...
        </p>
      </div>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">
            HR
          </div>

          <div>
            <strong>HR Admin</strong>
            <span>
              Management System
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-title">
            MAIN MENU
          </span>

          <NavButton
            icon="▦"
            label="Dashboard"
            active={
              activePage === "dashboard"
            }
            onClick={() =>
              navigate("dashboard")
            }
          />

          <NavButton
            icon="👥"
            label="Employees"
            count={employees.length}
            active={
              activePage === "employees"
            }
            onClick={() =>
              navigate("employees")
            }
          />

          <NavButton
            icon="✓"
            label="Attendance"
            active={
              activePage === "attendance"
            }
            onClick={() =>
              navigate("attendance")
            }
          />

          <NavButton
            icon="▣"
            label="Leave Management"
            count={
              pendingLeaves.length ||
              undefined
            }
            active={
              activePage === "leaves"
            }
            onClick={() =>
              navigate("leaves")
            }
          />

          <NavButton
            icon="▤"
            label="Departments"
            active={
              activePage === "departments"
            }
            onClick={() =>
              navigate("departments")
            }
          />

          <NavButton
            icon="★"
            label="Performance"
            active={
              activePage === "performance"
            }
            onClick={() =>
              navigate("performance")
            }
          />
        </nav>

        <div className="sidebar-bottom">
          <div className="admin-profile">
            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>Admin</strong>
              <span>HR Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>HR Admin</span>
            <b>/</b>
            <strong>
              {activePage
                .charAt(0)
                .toUpperCase() +
                activePage.slice(1)}
            </strong>
          </div>

          <div className="topbar-right">
            <div className="notification">
              <button
                className="notification-button"
                onClick={() => {
                  if (pendingLeaves.length) {
                    navigate("leaves");
                  }
                }}
              >
                🔔

                {pendingLeaves.length >
                  0 && (
                  <span>
                    {pendingLeaves.length}
                  </span>
                )}
              </button>
            </div>

            <div className="admin-top">
              <div className="top-avatar">
                A
              </div>

              <div>
                <strong>Admin</strong>
                <span>HR Admin</span>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="error-banner">
            <span>{error}</span>

            <button
              onClick={() => setError("")}
            >
              ×
            </button>
          </div>
        )}

        <div className="content-area">
          {renderPage()}
        </div>
      </main>

      {selectedEmployee && (
        <EmployeeProfile
          employee={selectedEmployee}
          onClose={() =>
            setSelectedEmployee(null)
          }
          onEdit={(employee) => {
            setSelectedEmployee(null);
            setEditingEmployee(employee);
          }}
        />
      )}

      {editingEmployee && (
        <Modal
          title="Edit Employee"
          onClose={() =>
            setEditingEmployee(null)
          }
          large
        >
          <EmployeeForm
            initialData={editingEmployee}
            departments={departments}
            onSubmit={(data) =>
              updateEmployee({
                ...editingEmployee,
                ...data,
              })
            }
            onCancel={() =>
              setEditingEmployee(null)
            }
          />
        </Modal>
      )}

      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}

function NavButton({
  icon,
  label,
  count,
  active,
  onClick,
}) {
  return (
    <button
      className={`nav-button ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      <span className="nav-icon">
        {icon}
      </span>

      <span>{label}</span>

      {count !== undefined && (
        <b>{count}</b>
      )}
    </button>
  );
}

export default App;