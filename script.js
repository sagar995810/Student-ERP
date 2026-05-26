const API_URL = (window.location.protocol !== 'file:' && window.location.origin && window.location.origin !== 'null')
  ? `${window.location.origin}/api`
  : 'http://localhost:3000/api';

const TIDIO_PUBLIC_KEY = window.TIDIO_PUBLIC_KEY || 'YOUR_TIDIO_PUBLIC_KEY';

function loadTidioChat() {
  if (!TIDIO_PUBLIC_KEY || TIDIO_PUBLIC_KEY === 'YOUR_TIDIO_PUBLIC_KEY') {
    console.info('Tidio is not configured yet. Set window.TIDIO_PUBLIC_KEY or replace YOUR_TIDIO_PUBLIC_KEY in script.js to enable the widget.');
    return;
  }

  if (document.querySelector(`script[src*="code.tidio.co/${TIDIO_PUBLIC_KEY}.js"]`)) {
    return;
  }

  const script = document.createElement('script');
  script.src = `https://code.tidio.co/${TIDIO_PUBLIC_KEY}.js`;
  script.async = true;
  document.head.appendChild(script);
}

loadTidioChat();

let currentStudent = null;

const navButtons = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');
const refreshButton = document.getElementById('refreshButton');
const themeButton = document.getElementById('themeButton');
const courseSearch = document.getElementById('courseSearch');
const updateDataButton = document.getElementById('updateDataButton');
const greetingText = document.getElementById('greetingText');
const gpaElement = document.getElementById('gpa');
const nextClassElement = document.getElementById('nextClass');
const pendingTasksElement = document.getElementById('pendingTasks');
const notificationsCountElement = document.getElementById('notificationsCount');
const courseProgress = document.getElementById('courseProgress');
const courseProgressText = document.getElementById('courseProgressText');
const assignmentProgress = document.getElementById('assignmentProgress');
const assignmentProgressText = document.getElementById('assignmentProgressText');

const loginPage = document.getElementById('loginPage');
const portalRoot = document.getElementById('portalRoot');
const loginForm = document.getElementById('loginForm');
const logoutButton = document.getElementById('logoutButton');
const chatPanel = document.getElementById('chatPanel');
const chatOpenButton = document.getElementById('chatOpenButton');
const chatToggle = document.getElementById('chatToggle');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');

// Assignment Elements
const assignmentSubmissionArea = document.getElementById('assignmentSubmissionArea');
const submitAssignmentTitle = document.getElementById('submitAssignmentTitle');
const submitAssignmentId = document.getElementById('submitAssignmentId');
const submissionForm = document.getElementById('submissionForm');
const submissionText = document.getElementById('submissionText');
const cancelSubmission = document.getElementById('cancelSubmission');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const menuToggle = document.getElementById('menuToggle');

function toggleSidebar() {
  sidebar.classList.toggle('open');
  if (window.innerWidth <= 900) {
    sidebarOverlay.classList.toggle('hidden');
  }
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.add('hidden');
}

menuToggle.addEventListener('click', toggleSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

function setActiveSection(sectionId) {
  sections.forEach(sec => sec.id === sectionId ? sec.classList.remove('hidden') : sec.classList.add('hidden'));
  navButtons.forEach(btn => btn.dataset.section === sectionId ? btn.classList.add('active') : btn.classList.remove('active'));
  if (window.innerWidth <= 900) closeSidebar();
}

navButtons.forEach(button => {
  button.addEventListener('click', () => setActiveSection(button.dataset.section));
});

refreshButton.addEventListener('click', async () => {
  if (currentStudent) {
    await fetchStudentData(currentStudent.email);
    updateUI();
    showToast('Portal refreshed successfully!');
  }
});

themeButton.addEventListener('click', () => {
  const currentTheme = document.body.dataset.theme || 'default';
  const nextTheme = currentTheme === 'default' ? 'dark' : (currentTheme === 'dark' ? 'sunset' : 'default');
  applyTheme(nextTheme);
});

if (courseSearch) {
  courseSearch.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const list = document.getElementById('coursesList');
    list.querySelectorAll('li').forEach(li => {
      li.style.display = li.textContent.toLowerCase().includes(query) ? '' : 'none';
    });
  });
}

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    if (result.success) {
      currentStudent = result.studentData;
      loginPage.classList.add('hidden');
      portalRoot.classList.remove('hidden');
      initPortal();
      showToast(`Welcome, ${currentStudent.name}!`);
    } else {
      showToast(result.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    showToast('Could not connect to server.');
  }
});

logoutButton.addEventListener('click', () => {
  portalRoot.classList.add('hidden');
  loginPage.classList.remove('hidden');
  chatPanel.classList.add('hidden');
  chatMessages.innerHTML = '';
  loginForm.reset();
  currentStudent = null;
  showToast('You are now logged out.');
});

chatOpenButton.addEventListener('click', () => {
  chatPanel.classList.toggle('hidden');
});

chatToggle.addEventListener('click', () => {
  chatPanel.classList.add('hidden');
});

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  appendChatMessage('user', text);
  chatInput.value = '';
  setTimeout(() => {
    appendChatMessage('bot', getBotResponse(text));
  }, 500);
});

async function fetchStudentData(email) {
  try {
    const response = await fetch(`${API_URL}/student/${email}`);
    currentStudent = await response.json();
  } catch (error) {
    console.error('Error fetching student data:', error);
  }
}

function initPortal() {
  applyTheme('default');
  setActiveSection('dashboard');
  updateUI();
}

function updateUI() {
  if (!currentStudent) return;

  // Dashboard
  const hour = new Date().getHours();
  let greeter = 'Have a productive day!';
  if (hour < 12) greeter = 'Good morning!';
  else if (hour < 18) greeter = 'Good afternoon!';
  else greeter = 'Good evening!';
  greetingText.textContent = `${greeter} ${currentStudent.name}`;

  gpaElement.textContent = currentStudent.gpa.toFixed(2);
  nextClassElement.textContent = currentStudent.nextClass;
  pendingTasksElement.textContent = currentStudent.pendingTasks;
  notificationsCountElement.textContent = currentStudent.notifications;

  courseProgress.style.width = `${currentStudent.completion.courses}%`;
  courseProgressText.textContent = `${currentStudent.completion.courses}%`;
  assignmentProgress.style.width = `${currentStudent.completion.assignments}%`;
  assignmentProgressText.textContent = `${currentStudent.completion.assignments}%`;

  const headerTitle = document.querySelector('.portal-header h1');
  if (headerTitle) {
    headerTitle.textContent = window.innerWidth <= 600 ? 'Portal' : `Student Portal - ${currentStudent.name}`;
  }

  // Courses
  const coursesList = document.getElementById('coursesList');
  coursesList.innerHTML = '';
  currentStudent.courses.forEach(c => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${c.name}</strong> <span class="course-code" style="float:right; opacity:0.7;">${c.code}</span>`;
    coursesList.appendChild(li);
  });

  // Grades
  const gradesTbody = document.querySelector('#gradesTable tbody');
  gradesTbody.innerHTML = '';
  currentStudent.grades.forEach(g => {
    const tr = document.createElement('tr');
    const avg = ((g.midterm + g.final) / 2).toFixed(1);
    tr.innerHTML = `<td>${g.subject}</td><td>${g.midterm}</td><td>${g.final}</td><td>${avg}</td>`;
    gradesTbody.appendChild(tr);
  });

  // Assignments
  loadAssignments();
  loadSubmissions();

  // Announcements
  const annList = document.getElementById('announcementList');
  annList.innerHTML = '';
  currentStudent.announcements.forEach(a => {
    const box = document.createElement('div');
    box.className = 'announcement-item';
    box.innerHTML = `<h4>${a.title}</h4><small>${new Date(a.date).toLocaleDateString()}</small><p style="margin:0.4rem 0 0;color:#2b3e62;">${a.desc}</p>`;
    annList.appendChild(box);
  });

  // Profile
  const profileGrid = document.querySelector('.profile-grid');
  profileGrid.innerHTML = `
    <div><strong>Name:</strong> ${currentStudent.name}</div>
    <div><strong>Roll No:</strong> ${currentStudent.rollNo}</div>
    <div><strong>Course:</strong> ${currentStudent.course}</div>
    <div><strong>Semester:</strong> ${currentStudent.semester}</div>
    <div><strong>Email:</strong> ${currentStudent.email}</div>
    <div><strong>Phone:</strong> ${currentStudent.phone}</div>
  `;
}

function loadAssignments() {
  assignmentsList.innerHTML = '';
  currentStudent.assignments.forEach(a => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    
    let actionBtn = '';
    if (a.status !== 'Submitted') {
      actionBtn = `<button class="action-btn" onclick="openSubmission('${a.id}', '${a.title}')">Submit</button>`;
    } else {
      actionBtn = `<span style="color: #23d18b; font-weight:700;">Submitted</span>`;
    }

    li.innerHTML = `
      <div>
        <strong>${a.title}</strong><br>
        <small>Due: ${new Date(a.due).toLocaleDateString()}</small>
      </div>
      <div>
        <span style="margin-right: 1rem; color: ${progressColor(a.status)}; font-weight:700;">${a.status}</span>
        ${actionBtn}
      </div>
    `;
    assignmentsList.appendChild(li);
  });
}

function loadSubmissions() {
  submissionsList.innerHTML = '';
  if (currentStudent.submissions.length === 0) {
    submissionsList.innerHTML = '<li style="text-align:center; opacity:0.6;">No past submissions found.</li>';
    return;
  }
  currentStudent.submissions.forEach(s => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${s.title}</strong><br>
      <small>Submitted on: ${new Date(s.date).toLocaleString()}</small>
      <p style="margin-top:0.5rem; font-size:0.85rem; background:#f0f4f8; padding:0.5rem; border-radius:4px;">${s.text}</p>
    `;
    submissionsList.appendChild(li);
  });
}

window.openSubmission = (id, title) => {
  submitAssignmentId.value = id;
  submitAssignmentTitle.textContent = title;
  assignmentSubmissionArea.classList.remove('hidden');
  assignmentSubmissionArea.scrollIntoView({ behavior: 'smooth' });
};

cancelSubmission.addEventListener('click', () => {
  assignmentSubmissionArea.classList.add('hidden');
  submissionForm.reset();
});

submissionForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = parseInt(submitAssignmentId.value);
  const text = submissionText.value.trim();

  try {
    const response = await fetch(`${API_URL}/submit-assignment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: currentStudent.email,
        assignmentId: id,
        submissionText: text
      })
    });

    const result = await response.json();
    if (result.success) {
      currentStudent = result.studentData;
      updateUI();
      assignmentSubmissionArea.classList.add('hidden');
      submissionForm.reset();
      showToast('Assignment submitted successfully!');
    } else {
      showToast(result.message || 'Submission failed');
    }
  } catch (error) {
    console.error('Submission error:', error);
    showToast('Could not submit assignment.');
  }
});

function progressColor(status) {
  if (status === 'Due') return '#e94242';
  if (status === 'In Progress') return '#f0a500';
  if (status === 'Submitted') return '#23d18b';
  return '#65748f';
}

function applyTheme(name) {
  document.body.dataset.theme = name;
  if (name === 'dark') {
    document.documentElement.style.setProperty('--bg', '#0a111f');
    document.documentElement.style.setProperty('--panel', '#0f1a33');
    document.documentElement.style.setProperty('--text', '#f5f8ff');
    document.documentElement.style.setProperty('--muted', '#b9c4e0');
  } else if (name === 'sunset') {
    document.documentElement.style.setProperty('--bg', '#ffe8d0');
    document.documentElement.style.setProperty('--panel', '#ffffff');
    document.documentElement.style.setProperty('--text', '#3c2b1d');
    document.documentElement.style.setProperty('--muted', '#785d44');
    document.documentElement.style.setProperty('--accent', '#ef6e61');
    document.documentElement.style.setProperty('--accent2', '#f9b449');
  } else {
    document.documentElement.style.setProperty('--bg', '#f5f8ff');
    document.documentElement.style.setProperty('--panel', '#ffffff');
    document.documentElement.style.setProperty('--text', '#1a243b');
    document.documentElement.style.setProperty('--muted', '#65748f');
    document.documentElement.style.setProperty('--accent', '#3f8efc');
    document.documentElement.style.setProperty('--accent2', '#23d18b');
  }
}

function appendChatMessage(type, message) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${type}`;
  bubble.textContent = message;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getUpcomingAssignments() {
  if (!currentStudent?.assignments?.length) return [];

  return currentStudent.assignments
    .filter(assignment => assignment.status !== 'Submitted')
    .sort((a, b) => new Date(a.due) - new Date(b.due))
    .slice(0, 3);
}

function getTopGrade() {
  if (!currentStudent?.grades?.length) return null;

  return currentStudent.grades.reduce((best, current) => {
    const bestAverage = (best.midterm + best.final) / 2;
    const currentAverage = (current.midterm + current.final) / 2;
    return currentAverage > bestAverage ? current : best;
  });
}

function getSmartGuidance() {
  const upcomingAssignments = getUpcomingAssignments();
  const topGrade = getTopGrade();

  if (upcomingAssignments.length === 0 && topGrade) {
    return `Your strongest subject is ${topGrade.subject} with an average of ${(((topGrade.midterm + topGrade.final) / 2)).toFixed(1)}. Keep up the momentum and review your next class schedule.`;
  }

  if (upcomingAssignments.length > 0) {
    const first = upcomingAssignments[0];
    return `Your next action is ${first.title} due ${formatDate(first.due)}. You can open the Assignments tab or submit it directly from the portal.`;
  }

  return 'You are all caught up for now. If you want, I can help you check grades, assignments, or announcements.';
}

function getBotResponse(text) {
  if (!currentStudent) {
    return 'You are not logged in yet. Please sign in to get personalized chatbot help.';
  }

  const c = text.toLowerCase().trim();

  if (!c) {
    return 'Please type a question about your classes, assignments, grades, or announcements.';
  }

  if (['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'].some(keyword => c.includes(keyword))) {
    return `Hello ${currentStudent.name}! I can help with your grades, assignments, upcoming classes, announcements, and portal navigation.`;
  }

  if (c.includes('thank') || c.includes('thanks')) {
    return 'You are welcome! If you need anything else, I am here to help.';
  }

  if (c.includes('gpa') || c.includes('grade average') || c.includes('overall')) {
    return `Your current GPA is ${currentStudent.gpa.toFixed(2)}. ${getSmartGuidance()}`;
  }

  if (c.includes('grade') || c.includes('grades') || c.includes('marks')) {
    const topGrade = getTopGrade();
    const gradeSummary = currentStudent.grades.map(g => `${g.subject}: ${((g.midterm + g.final) / 2).toFixed(1)}`).join(', ');
    return `Here are your recent grades: ${gradeSummary}. Your strongest subject is ${topGrade?.subject || 'not available'} with an average of ${topGrade ? (((topGrade.midterm + topGrade.final) / 2)).toFixed(1) : 'N/A'}.`;
  }

  if (c.includes('assignment') || c.includes('submit') || c.includes('due')) {
    const upcomingAssignments = getUpcomingAssignments();

    if (upcomingAssignments.length === 0) {
      return 'You do not have any pending assignments right now. You can check the Assignments tab for completed submissions.';
    }

    const assignmentList = upcomingAssignments
      .map(item => `${item.title} (${item.status}) — due ${formatDate(item.due)}`)
      .join('; ');

    return `Here are your upcoming assignments: ${assignmentList}. ${getSmartGuidance()}`;
  }

  if (c.includes('next class') || c.includes('class') || c.includes('schedule')) {
    return `Your next class is ${currentStudent.nextClass}. You can also check the Dashboard for the latest class reminder.`;
  }

  if (c.includes('announcement') || c.includes('news') || c.includes('updates')) {
    if (!currentStudent.announcements?.length) {
      return 'There are no announcements right now. Check back later for campus updates.';
    }

    const announcementList = currentStudent.announcements
      .map(item => `${item.title}: ${item.desc}`)
      .join(' | ');

    return `Latest announcements: ${announcementList}.`;
  }

  if (c.includes('pending') || c.includes('notification') || c.includes('tasks')) {
    return `You currently have ${currentStudent.pendingTasks} pending task(s) and ${currentStudent.notifications} notification(s). ${getSmartGuidance()}`;
  }

  if (c.includes('contact') || c.includes('phone') || c.includes('email') || c.includes('profile')) {
    return `Your profile shows ${currentStudent.name}, ${currentStudent.course}, semester ${currentStudent.semester}, email ${currentStudent.email}, and phone ${currentStudent.phone}.`;
  }

  if (c.includes('help') || c.includes('what can you do')) {
    return 'I can help with grades, assignments, upcoming classes, announcements, pending tasks, notifications, and profile details. Try asking “What are my grades?” or “What is due soon?”';
  }

  if (c.includes('show me') || c.includes('tell me')) {
    return getSmartGuidance();
  }

  return `I can help with your portal. For example, ask about your grades, assignments, next class, announcements, or pending tasks. ${getSmartGuidance()}`;
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '12px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = 'rgba(31, 33, 85, 0.94)';
  toast.style.color = '#fff';
  toast.style.padding = '0.5rem 1rem';
  toast.style.borderRadius = '6px';
  toast.style.zIndex = 999;
  toast.style.fontSize = '0.85rem';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1700);
}
