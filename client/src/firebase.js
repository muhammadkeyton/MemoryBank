import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.react_app_apiKey,
  authDomain: process.env.react_app_authdomain,
  projectId:process.env.projectid ,
  storageBucket:process.env.storagebucket ,
  messagingSenderId:process.env.messagingsenderId ,
  appId:process.env.appid,
  measurementId:process.env.measurementid
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)