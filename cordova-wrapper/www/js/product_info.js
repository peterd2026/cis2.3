import { db } from './firebaseConfig.js';
import { getStorage, ref as storageRef, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js';
import {
  getAuth, sendPasswordResetEmail, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';


function getQueryParams() {
  var queryParams = {};
  location.search
    .substring(1)
    .split('&')
    .forEach(function (paramPair) {
      const pair = paramPair.split('=');
      queryParams[pair[0]] = decodeURIComponent(pair[1]);
    });
  return queryParams;
}
document.addEventListener('DOMContentLoaded', () => {
  var params = getQueryParams();
  var itemId = params.itemId;

  const storage = getStorage(); // Initialize Firebase Storage instance

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User is logged in:', user);
      console.log('User is logged in:', user.uid);
    } else {
      window.location.href = 'login.html';
    }
  });

  getDocs(collection(db, 'items'))
    .then((querySnapshot) => {
      const itemList = document.getElementById('info'); // Get the container element
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.id === itemId) {
          const imageRef = storageRef(storage, `${data.id}.png`); // Construct the reference to the image file
          getDownloadURL(imageRef) // Fetch the URL for the image
            .then((url) => {
              const div = document.createElement('div'); // Create a new div element
              div.innerHTML = `
                <div style="height: 354px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
                <div style="align-self: stretch; height: 240px; background-image: url('${url}'); border-radius: 8px"></div>
                <div style="color: black; font-size: 16px; font-family: Inter; font-weight: 700; word-wrap: break-word">${data.name}</div>
                <div style="width: 343px; height: 79px; position: relative">
                  <div style="width: 343px; left: 0px; top: 0px; position: absolute; color: black; font-size: 14px; font-family: Inter; font-weight: 400; word-wrap: break-word">${data.quantity}</div>
                  <div style="left: -0px; top: 25px; position: absolute; text-align: right; color: #94BF1A; font-size: 12px; font-family: Inter; font-weight: 300; word-wrap: break-word">Uploaded on ${data.time} by <a style="font-family: Inter; font-weight: 300; text-decoration: underline; color: #94BF1A;" href="another_profile.html?userId=${data.userId}&itemId=${data.id}">${data.username}</a> </div>
                </div>
              </div>

            `;
              itemList.appendChild(div); // Append the div to the container element
            })
            .catch((error) => {
              console.error('Error getting download URL: ', error);
            });
        }
      });
    })
    .catch((error) => {
      console.error('Error getting documents: ', error);
    });
});
