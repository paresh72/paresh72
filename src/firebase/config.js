// import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAMz04Q8bGNjkaEEglWFvjOLncjLiKErcU",
//   authDomain: "fir-radix-tutorial.firebaseapp.com",
//   databaseURL: "gs://fir-radix-tutorial.appspot.com",
//   projectId: "fir-radix-tutorial",
//   storageBucket: "fir-radix-tutorial.appspot.com",
//   messagingSenderId: "657563510571",
//   appId: "1:657563510571:web:2aba031da89bead70ec76e",
//   measurementId: "G-Q0YLGJ898H",
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyDj08fPZ0QpL9i1DbhdJCooJEI4N9ulRKA",
//   authDomain: "student-form-116cf.firebaseapp.com",
//   databaseURL: "gs://student-form-116cf.appspot.com/",
//   projectId: "student-form-116cf",
//   storageBucket: "student-form-116cf.appspot.com",
//   messagingSenderId: "1093185692325",
//   appId: "1:1093185692325:web:208d7103eef8cc54cbe34c",
//   measurementId: "G-LEBRVDX2L9",
// };

// firebase.initializeApp(firebaseConfig);

// const storage = firebase.storage();

// export { storage, firebase as default };

// const uploadTask = storage.ref(`images/${videos.name}`).put(videos);
// uploadTask.on(
//   "state_changed",
//   (snapshot) => {},
//   (error) => {
//     console.log(error);
//   },
//   () => {
//     storage
//       .ref("images")
//       .child(videos.name)
//       .getDownloadURL()
//       .then((url) => {
//         console.log(url);
//       });
//   }
// );
