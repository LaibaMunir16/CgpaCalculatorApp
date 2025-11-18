import { useState } from "react";
import "./App.css";

const gradePoints = {
  "A+": 4.0,
  "A": 3.7,
  "B+": 3.3,
  "B": 3.0,
  "C+": 2.7,
  "C": 2.3,
  "D": 2.0,
  "F": 0.0,
};

export default function App() {
  const [courses, setCourses] = useState([{ name: "", credit: "", grade: "" }]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const addCourse = () => setCourses([...courses, { name: "", credit: "", grade: "" }]);

  const removeCourse = (index) => setCourses(courses.filter((_, i) => i !== index));

  const handleChange = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
  };

  const calculateCGPA = () => {
    setError("");
    let totalCredits = 0;
    let totalPoints = 0;

    for (let course of courses) {
      const { name, credit, grade } = course;

      if (!name || !credit || !grade) {
        setError("All fields must be filled.");
        setResult(null);
        return;
      }

      const numericCredit = parseFloat(credit);
      if (isNaN(numericCredit) || numericCredit <= 0) {
        setError("Credit hours must be positive numbers.");
        setResult(null);
        return;
      }

      if (!(grade.toUpperCase() in gradePoints)) {
        setError("Grade must be one of: A+, A, B+, B, C+, C, D, F.");
        setResult(null);
        return;
      }

      totalCredits += numericCredit;
      totalPoints += numericCredit * gradePoints[grade.toUpperCase()];
    }

    const cgpa = totalPoints / totalCredits;
    setResult({ totalCredits, totalPoints, cgpa: cgpa.toFixed(2) });
  };

  const resetForm = () => {
    setCourses([{ name: "", credit: "", grade: "" }]);
    setResult(null);
    setError("");
  };

  return (
    <div className={darkMode ? "dark-mode app-container" : "app-container"}>
      <header className="header">
        <h1>CGPA Calculator</h1>
        <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Credit Hours</th>
                <th>Grade</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      placeholder="Course Name"
                      value={course.name}
                      onChange={(e) => handleChange(index, "name", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="Credit Hours"
                      value={course.credit}
                      onChange={(e) => handleChange(index, "credit", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Grade (A+, A...)"
                      value={course.grade}
                      onChange={(e) => handleChange(index, "grade", e.target.value)}
                    />
                  </td>
                  <td>
                    <button className="remove-btn" onClick={() => removeCourse(index)}>
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="buttons">
          <button className="add-btn" onClick={addCourse}>
            Add Course
          </button>
          <button className="calculate-btn" onClick={calculateCGPA}>
            Calculate CGPA
          </button>
          <button className="reset-btn" onClick={resetForm}>
            Reset
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {result && (
          <div className="result">
            <h2>CGPA Result</h2>
            <p>Total Credit Hours: {result.totalCredits}</p>
            <p>Total Grade Points: {result.totalPoints.toFixed(2)}</p>
            <h3>Final CGPA: {result.cgpa}</h3>
          </div>
        )}
      </div>
    </div>
  );
}