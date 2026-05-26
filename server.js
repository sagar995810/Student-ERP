const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;
const db = new Database('portal.db');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Helper to get full student data
function getFullStudentData(email) {
  const student = db.prepare('SELECT * FROM students WHERE email = ?').get(email);
  if (!student) return null;

  student.courses = db.prepare('SELECT name, code FROM courses WHERE student_email = ?').all(email);
  student.grades = db.prepare('SELECT subject, midterm, final FROM grades WHERE student_email = ?').all(email);
  student.assignments = db.prepare('SELECT id, title, due, status FROM assignments WHERE student_email = ?').all(email);
  student.announcements = db.prepare('SELECT title, desc, date FROM announcements WHERE student_email = ?').all(email);
  student.submissions = db.prepare('SELECT * FROM submissions WHERE student_email = ?').all(email);
  
  // Map courseCompletion to completion.courses for frontend compatibility
  student.completion = {
    courses: student.courseCompletion,
    assignments: student.assignmentCompletion
  };

  return student;
}

// Routes
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const student = db.prepare('SELECT * FROM students WHERE email = ? AND password = ?').get(email, password);

  if (student) {
    const fullData = getFullStudentData(email);
    res.json({ success: true, studentData: fullData });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

app.get('/api/student/:email', (req, res) => {
  const { email } = req.params;
  const fullData = getFullStudentData(email);

  if (fullData) {
    res.json(fullData);
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

app.post('/api/submit-assignment', (req, res) => {
  const { email, assignmentId, submissionText } = req.body;
  
  const assignment = db.prepare('SELECT * FROM assignments WHERE id = ? AND student_email = ?').get(assignmentId, email);
  
  if (assignment) {
    db.prepare('UPDATE assignments SET status = ? WHERE id = ?').run('Submitted', assignmentId);
    db.prepare('INSERT INTO submissions (student_email, assignment_id, title, text, date) VALUES (?, ?, ?, ?, ?)')
      .run(email, assignmentId, assignment.title, submissionText, new Date().toISOString());
    
    db.prepare('UPDATE students SET pendingTasks = MAX(0, pendingTasks - 1) WHERE email = ?').run(email);
    
    const fullData = getFullStudentData(email);
    res.json({ success: true, message: 'Assignment submitted successfully', studentData: fullData });
  } else {
    res.status(404).json({ message: 'Assignment not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
