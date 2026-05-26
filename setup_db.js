const Database = require('better-sqlite3');
const db = new Database('portal.db');

// Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    email TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    rollNo TEXT NOT NULL,
    course TEXT NOT NULL,
    semester INTEGER NOT NULL,
    phone TEXT NOT NULL,
    gpa REAL NOT NULL,
    nextClass TEXT NOT NULL,
    pendingTasks INTEGER NOT NULL,
    notifications INTEGER NOT NULL,
    courseCompletion INTEGER NOT NULL,
    assignmentCompletion INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_email TEXT,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    FOREIGN KEY(student_email) REFERENCES students(email)
  );

  CREATE TABLE IF NOT EXISTS grades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_email TEXT,
    subject TEXT NOT NULL,
    midterm INTEGER NOT NULL,
    final INTEGER NOT NULL,
    FOREIGN KEY(student_email) REFERENCES students(email)
  );

  CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_email TEXT,
    title TEXT NOT NULL,
    due TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY(student_email) REFERENCES students(email)
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_email TEXT,
    title TEXT NOT NULL,
    desc TEXT NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY(student_email) REFERENCES students(email)
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_email TEXT,
    assignment_id INTEGER,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY(student_email) REFERENCES students(email)
  );
`);

const insertStudent = db.prepare(`
  INSERT OR REPLACE INTO students (email, password, name, rollNo, course, semester, phone, gpa, nextClass, pendingTasks, notifications, courseCompletion, assignmentCompletion)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertCourse = db.prepare(`INSERT INTO courses (student_email, name, code) VALUES (?, ?, ?)`);
const insertGrade = db.prepare(`INSERT INTO grades (student_email, subject, midterm, final) VALUES (?, ?, ?, ?)`);
const insertAssignment = db.prepare(`INSERT INTO assignments (student_email, title, due, status) VALUES (?, ?, ?, ?)`);
const insertAnnouncement = db.prepare(`INSERT INTO announcements (student_email, title, desc, date) VALUES (?, ?, ?, ?)`);

// Data for Students
const studentsData = [
  {
    email: 'alex.johnson@example.com',
    password: 'password123',
    name: 'Alex Johnson',
    rollNo: '210123456',
    course: 'B.Tech Computer Science',
    semester: 4,
    phone: '+91 98765 43210',
    gpa: 8.2,
    nextClass: 'Data Structures - 11:00 AM',
    pendingTasks: 2,
    notifications: 3,
    courseCompletion: 72,
    assignmentCompletion: 85,
    courses: [
      ['Data Structures', 'CS202'], ['Database Systems', 'CS204'], ['Operating Systems', 'CS206']
    ],
    grades: [
      ['Data Structures', 82, 89], ['Database Systems', 78, 85]
    ],
    assignments: [
      ['DS Homework - Trees', '2026-03-28', 'Due'], ['DB Project - ER Diagram', '2026-03-31', 'In Progress']
    ],
    announcements: [
      ['Semester Break', 'Mid-term break from April 10 to 14', '2026-03-20']
    ]
  },
  {
    email: 'jane.smith@example.com',
    password: 'password123',
    name: 'Jane Smith',
    rollNo: '210123789',
    course: 'B.Tech AI & ML',
    semester: 4,
    phone: '+91 91234 56789',
    gpa: 9.1,
    nextClass: 'Machine Learning - 10:00 AM',
    pendingTasks: 1,
    notifications: 5,
    courseCompletion: 80,
    assignmentCompletion: 92,
    courses: [
      ['Machine Learning', 'AI202'], ['Neural Networks', 'AI204']
    ],
    grades: [
      ['Machine Learning', 92, 95]
    ],
    assignments: [
      ['ML Project - Regression', '2026-04-05', 'In Progress']
    ],
    announcements: [
      ['AI Workshop', 'Free workshop on OpenAI APIs', '2026-03-25']
    ]
  },
  {
    email: 'sagar@edu.com',
    password: '@123456',
    name: 'Sagar',
    rollNo: '210123999',
    course: 'B.Tech Information Technology',
    semester: 6,
    phone: '+91 99887 76655',
    gpa: 7.8,
    nextClass: 'Cyber Security - 01:00 PM',
    pendingTasks: 4,
    notifications: 2,
    courseCompletion: 65,
    assignmentCompletion: 70,
    courses: [
      ['Cyber Security', 'IT302'], ['Web Dev 2.0', 'IT304']
    ],
    grades: [
      ['Web Dev 2.0', 80, 82]
    ],
    assignments: [
      ['Cyber Security - PenTesting', '2026-04-10', 'Pending']
    ],
    announcements: [
      ['Hackathon 2026', 'Join the annual campus hackathon!', '2026-03-28']
    ]
  },
  {
    email: 'priya.sharma@example.com',
    password: 'password123',
    name: 'Priya Sharma',
    rollNo: '210123111',
    course: 'B.Tech Computer Science',
    semester: 4,
    phone: '+91 98989 89898',
    gpa: 8.8,
    nextClass: 'Algorithms - 09:00 AM',
    pendingTasks: 3,
    notifications: 4,
    courseCompletion: 75,
    assignmentCompletion: 80,
    courses: [
      ['Algorithms', 'CS201'], ['Computer Networks', 'CS203']
    ],
    grades: [
      ['Algorithms', 85, 90]
    ],
    assignments: [
      ['Sorting Analysis', '2026-04-01', 'Pending']
    ],
    announcements: [
      ['Tech Fest', 'Annual tech fest starts next month', '2026-03-27']
    ]
  },
  {
    email: 'rahul.verma@example.com',
    password: 'password123',
    name: 'Rahul Verma',
    rollNo: '210123222',
    course: 'B.Tech Mechanical',
    semester: 2,
    phone: '+91 97777 66666',
    gpa: 7.5,
    nextClass: 'Thermodynamics - 02:00 PM',
    pendingTasks: 5,
    notifications: 1,
    courseCompletion: 40,
    assignmentCompletion: 55,
    courses: [
      ['Thermodynamics', 'ME101'], ['Applied Mechanics', 'ME103']
    ],
    grades: [
      ['Thermodynamics', 70, 72]
    ],
    assignments: [
      ['Heat Transfer Lab', '2026-04-08', 'Due']
    ],
    announcements: [
      ['Industrial Visit', 'Visit to Tata Motors scheduled', '2026-03-26']
    ]
  }
];

const transaction = db.transaction((students) => {
  for (const s of students) {
    insertStudent.run(
      s.email, s.password, s.name, s.rollNo, s.course, s.semester, s.phone,
      s.gpa, s.nextClass, s.pendingTasks, s.notifications, s.courseCompletion, s.assignmentCompletion
    );
    for (const c of s.courses) insertCourse.run(s.email, ...c);
    for (const g of s.grades) insertGrade.run(s.email, ...g);
    for (const a of s.assignments) insertAssignment.run(s.email, ...a);
    for (const an of s.announcements) insertAnnouncement.run(s.email, ...an);
  }
});

transaction(studentsData);
console.log('Database initialized with more student data.');
