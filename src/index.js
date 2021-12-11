import { initializeApp } from "firebase/app";
import {
    // collection >>> get reference to a collection
    // onSnapshot >>> to set up real time listener
    // onSnapshot() >>> set up the subscription to (the argument it pass in), to get notified of any changes
    getFirestore, collection, getDocs, onSnapshot,

    // doc >>> get reference to a doc. kinda like get metadata元數據
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    getDoc,
    updateDoc,
    
} from 'firebase/firestore'

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut, signInWithEmailAndPassword,
// onAuthStateChanged >>> to set up real time subscription to the login status of the current user. every time there's an authentication status change, it'll fire some kund of function
  onAuthStateChanged,
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCiaHZS1dqNecc4LALn-kT9HZ8wCutr7IU",
    authDomain: "halaplan-eb5bd.firebaseapp.com",
    projectId: "halaplan-eb5bd",
    storageBucket: "halaplan-eb5bd.appspot.com",
    messagingSenderId: "127654828245",
    appId: "1:127654828245:web:d2d9f22252b774bf0aea5c",
    measurementId: "G-LJ743Y7122"
  };

  // init firebase app
  initializeApp(firebaseConfig)

  // init services
  const db = getFirestore()
  const auth = getAuth()

  // collection ref
  // to get reference to books collection
  const colRef = collection(db,'books')



/* queries */
  // query(colRef, where("author", "==", "qq"), orderBy('title','desc'))
  // where(field name, comparison, value )
  // orderBy('fieldName','desc or asc') >>> by default is ascending order
  const q =query(colRef, orderBy('creatAt'))

  // real time data
  // onSnapshot() returns a unsubscribe function
  const unsubCol = onSnapshot(q, (snapshop)=>{
    console.log('snapshop.docs is', snapshop.docs);
    let books = []
    snapshop.docs.forEach((doc)=>{
       // push an object each time
       // doc.data() >>> use data() method on the doc object to get data from each document
       // ...doc.data() >>> spread that into our new object
       // add id for each object
        books.push( {...doc.data(), id:doc.id})
   })
   console.log(books);
})

/*
    //  to get collection data
  //  getDocs(colRef) >>> returns a promise
  getDocs(colRef)
    .then((snapshop) => {
        console.log('snapshop.docs is', snapshop.docs);
       let books = []
       snapshop.docs.forEach((doc)=>{
           // push an obej each time
           // doc.data() >>> use data() method on the doc object to get data from each document
           // ...doc.data() >>> spread that into our new obeject
           // add id for each object
            books.push( {...doc.data(), id:doc.id})
       })
       console.log(books);
       
    } )
    .catch(err=>{
        console.log(err.message);
    })
*/

/*  real time collection data
    //  onSnapshot(collectionReference, callback which fires everytime there is a change and it sends back a new snapshot )
    //  onSnapshot() also run initially and every time there is a change afterwards
    onSnapshot(colRef, (snapshop)=>{
        console.log('snapshop.docs is', snapshop.docs);
        let books = []
        snapshop.docs.forEach((doc)=>{
           // push an object each time
           // doc.data() >>> use data() method on the doc object to get data from each document
           // ...doc.data() >>> spread that into our new object
           // add id for each object
            books.push( {...doc.data(), id:doc.id})
       })
       console.log(books);
    })
*/


/* adding docs */
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

    // addDoc() is async function
  addDoc(colRef, {
    title: addBookForm.bookTitle.value,
    author: addBookForm.byAuthor.value,
    creatAt: serverTimestamp()
  })
  .then(() => {
    addBookForm.reset()
  })
  
})

/* deleting docs */
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  // doc(database, 'collection name', docRef)
  const docRef = doc(db, 'books', deleteBookForm.bookId.value)
  
  // deleteDoc() >>> is async function
  deleteDoc(docRef)
  .then(()=>{
    deleteBookForm.reset()
  })
  
})

/* get a single document */

// doc(database, 'collection name', docRef)
const docRef = doc(db, 'books', 'w2Ybzm2AiWkXNfiJPbnN')

/*
// getDoc() >>> returns a promise
getDoc(docRef)
    // .then(callBack) >>> when we have that single doc, we can fire that call back function
    .then((doc)=>{
        // doc.data() >>> use data() method on the doc object to get data from each document
        console.log(doc.data(), doc.id);
    })
*/


// set up the subscription to docRef to get notified of any changes
// onSnapshot(subscriber, callback) callback which fires everytime there is a change and it sends back a new snapshot 
// onSnapshot() also run initially and every time there is a change afterwards
// onSnapshot() returns unsubscribe function
const unsubDoc = onSnapshot(docRef, (doc)=>{
    console.log(doc.data(), doc.id);
}) 


/* updating a document */
// const updateForm = document.querySelector('.update')
// updateForm.addEventListener('submit', (e) => {
//   e.preventDefault()

//   let docRef = doc(db, 'books', updateForm.bookId.value)

//   // updateDoc() is async
//   updateDoc(docRef, {
//     title: 'updated title'
//   })
//   .then(() => {
//     updateForm.reset()
//   })

  
// })

const updateForm = document.querySelector('.update')
console.log(updateForm)

updateForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let docRef = doc(db, 'books', updateForm.bookId.value)

  updateDoc(docRef, {
    bookTitle: 'updated title'
  })
  .then(() => {
    console.log(updateForm.bookId.value)
    //updateForm.reset()
  })
})


/* signing users up */
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value
  // createUserWithEmailAndPassword() is async and returns promise
  createUserWithEmailAndPassword(auth, email, password)
   .then((credentialObj)=>{
     // credentialObj.user >>> user property on credentialObject
      console.log('user created: ',credentialObj.user);
      signupForm.reset()
   })
   .catch((err)=>{
      console.log((err.message));
   })
   
})


/* logging out */
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
  // signOut() >>> is async and returns promise
  signOut(auth)
    // .then(()=>{}) >>> fire the callback function when it is done 
    .then(()=>{
      console.log('the user sign out');
    })
    .catch((err)=>{
      console.log(err.message);
    })

})

/* logging in */
const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()
  
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  // signInWithEmailAndPassword() >>> is async and returns promise
  signInWithEmailAndPassword(auth, email, password)
    .then((credentialObj)=>{
      // use user property to get userObject
      console.log('user logged in:', credentialObj.user);
    })
    .catch((err)=>{
        console.log(err.message)
    })
})

/* subscribing to auth change */
// onSnapshot() >>> set up the subscription to (the argument it pass in), to get notified of any changes
// onAuthStateChanged() >>> returns unsubscribe function
const unsubAuth = onAuthStateChanged(auth, (user)=>{
  console.log('user status changed:', user);
})

/* unsubscribing from changes (auth & db) */
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
  console.log('unsubscribing:');
  unsubCol()
  unsubDoc
  unsubAuth()
})