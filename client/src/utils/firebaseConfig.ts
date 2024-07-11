import { initializeApp } from 'firebase/app';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDLni82ZF_DhdS7LXdqfFK4Z8llg0PfPXQ",
  authDomain: "bounty-romance.firebaseapp.com",
  projectId: "bounty-romance",
  storageBucket: "bounty-romance.appspot.com",
  messagingSenderId: "735539035493",
  appId: "1:735539035493:web:ea4c93133bb987b964f58c",
  measurementId: "G-LXZE5ELD3X"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };