import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAb9N-Tyqzb3rqsSZHYhNuANfyifYZLozk",
  authDomain: "fitnezbit.firebaseapp.com",
  projectId: "fitnezbit",
  storageBucket: "fitnezbit.appspot.com",
  messagingSenderId: "732563680929",
  appId: "1:732563680929:web:b152a805848d2181c2cae0"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export default firebase;