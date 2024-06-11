import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAZz6rBW7Wnqsu-GUQRltj8ts7c9CtPWIQ",
    authDomain: "app-chat-auth-f3a85.firebaseapp.com",
    projectId: "app-chat-auth-f3a85",
    storageBucket: "app-chat-auth-f3a85.appspot.com",
    messagingSenderId: "738468182884",
    appId: "1:738468182884:web:47bd3fda41b9bed8edd871"
  };

  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }
  export {firebase};