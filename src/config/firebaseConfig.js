import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
  apiKey: "AIzaSyCIjVYzuC47MS4VlV9y8E1ztdw5cfbsW0o",
  authDomain: "wireframer-f5cbd.firebaseapp.com",
  databaseURL: "https://wireframer-f5cbd.firebaseio.com",
  projectId: "wireframer-f5cbd",
  storageBucket: "wireframer-f5cbd.appspot.com",
  messagingSenderId: "982528601325",
  appId: "1:982528601325:web:819db6f667c9e03fdc30e4",
  measurementId: "G-18PFE2SD6F"
};
firebase.initializeApp(firebaseConfig);

export default firebase;