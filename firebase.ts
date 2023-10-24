import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getAuth} from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyArCIznJqt7s6F2lOCv_aWNw4F3sTErVOk",
  authDomain: "chatgpt-chatapp-a15c1.firebaseapp.com",
  projectId: "chatgpt-chatapp-a15c1",
  storageBucket: "chatgpt-chatapp-a15c1.appspot.com",
  messagingSenderId: "1040992401836",
  appId: "1:1040992401836:web:1d1eeca1ac788a20d86209"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);