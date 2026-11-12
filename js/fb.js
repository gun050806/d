// Firebase 연결과 공통 도구 모음
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {
  getAuth, connectAuthEmulator, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut, sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {
  getFirestore, connectFirestoreEmulator, doc, getDoc, setDoc, updateDoc, deleteDoc,
  addDoc, collection, query, where, getDocs, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { firebaseConfig } from '../firebase-config.js';

// 설정값이 채워져 있어야 동작해요.
export const ready = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let auth = null;
let db = null;

if (ready) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  // 개발용: 내 컴퓨터(localhost)에서 ?emu 를 붙여 열면 Firebase 에뮬레이터에 연결해요.
  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  let emu = false;
  try {
    if (new URLSearchParams(location.search).has('emu')) sessionStorage.setItem('emu', '1');
    emu = sessionStorage.getItem('emu') === '1';
  } catch (e) { /* 저장소를 못 써도 무시 */ }
  if (local && emu) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
  }
}

export {
  auth, db, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, sendPasswordResetEmail, doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc,
  collection, query, where, getDocs, serverTimestamp
};

// 화면에 글자를 넣을 때 HTML 코드로 해석되지 않도록 바꿔 줘요.
export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// http(s) 주소만 링크로 허용해요.
export function safeUrl(value) {
  return /^https?:\/\//i.test(String(value || '').trim()) ? String(value).trim() : '';
}

// 오늘 날짜 (YYYY-MM-DD)
export function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// 내 회원 정보 (없으면 null)
export async function getProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

// 로그인 상태가 확인될 때까지 기다려요.
export function currentUser() {
  return new Promise((resolve) => {
    const stop = onAuthStateChanged(auth, (user) => { stop(); resolve(user); });
  });
}

// Firebase 오류를 한국어로 바꿔요.
export function errMsg(e) {
  const code = (e && e.code) || '';
  const map = {
    'auth/invalid-email': '이메일 형식이 올바르지 않아요.',
    'auth/missing-password': '비밀번호를 입력해 주세요.',
    'auth/weak-password': '비밀번호는 6자 이상이어야 해요.',
    'auth/email-already-in-use': '이미 가입된 이메일이에요. 로그인해 주세요.',
    'auth/invalid-credential': '이메일 또는 비밀번호가 맞지 않아요.',
    'auth/wrong-password': '이메일 또는 비밀번호가 맞지 않아요.',
    'auth/user-not-found': '이메일 또는 비밀번호가 맞지 않아요.',
    'auth/too-many-requests': '시도가 너무 많아요. 잠시 후 다시 해 주세요.',
    'auth/network-request-failed': '인터넷 연결을 확인해 주세요.',
    'permission-denied': '권한이 없어요. 원장님 승인 여부를 확인해 주세요.',
    'unavailable': '서버에 연결할 수 없어요. 잠시 후 다시 해 주세요.'
  };
  return map[code] || '문제가 생겼어요. 잠시 후 다시 해 주세요.' + (code ? ` (${code})` : '');
}

// 설정 전 안내 문구
export const NOT_READY_HTML =
  '<p class="msg msg--warn">아직 로그인 기능이 준비되지 않았어요. (Firebase 설정값을 넣어야 해요)</p>';
