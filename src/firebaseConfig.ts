import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3Ag1NwkhMSHqK4pfvnmjMH85vxPMWXKs",
  authDomain: "mediamatchup-ac7a9.firebaseapp.com",
  projectId: "mediamatchup-ac7a9",
  storageBucket: "mediamatchup-ac7a9.appspot.com",
  messagingSenderId: "189212241219",
  appId: "1:189212241219:web:dde3668d395321834f53f6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const authProvider = new GoogleAuthProvider();

export function signInWithGoogle(): void {
  signInWithPopup(auth, authProvider);
}
export function signOut(): void {
  auth.signOut();
}
