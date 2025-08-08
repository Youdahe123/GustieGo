// API utility for backend endpoints

const API_BASE = import.meta.env.VITE_API_BASE || '';

// User APIs
export async function registerUser(data: any) {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function loginUser(data: any) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Shift APIs
export async function makeShift(data: any) {
  const res = await fetch(`${API_BASE}/shift/makeShift`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function claimShift(data: any) {
  const res = await fetch(`${API_BASE}/shift/claimShift`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function giveAwayShift(data: any) {
  const res = await fetch(`${API_BASE}/shift/giveAway`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getAvailableShifts() {
  const res = await fetch(`${API_BASE}/shift/available`);
  return res.json();
}

export async function reportAbsence(data: any) {
  const res = await fetch(`${API_BASE}/shift/absence`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Info APIs
export async function getAbout() {
  const res = await fetch(`${API_BASE}/info/about`);
  return res.json();
}

export async function getDocs() {
  const res = await fetch(`${API_BASE}/info/docs`);
  return res.json();
}

// Analytics API
export async function getStudentAnalytics(id: string) {
  const res = await fetch(`${API_BASE}/analytics/student/${id}`);
  return res.json();
} 