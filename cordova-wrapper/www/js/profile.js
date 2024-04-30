import { db } from './firebaseConfig.js';
import { getStorage, ref as storageRef, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js';
import { collection, getDocs, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
  const storage = getStorage(); // Initialize Firebase Storage instance

  getDocs(collection(db, 'listings'))
    .then((querySnapshot) => {
      const itemList = document.getElementById('listing-content'); // Get the container element
      let i = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const imageRef = storageRef(storage, `listings/${data.id}.png`); // Construct the reference to the image file

        getDownloadURL(imageRef) // Fetch the URL for the image
          .then((url) => {
            const div = document.createElement('div'); // Create a new div element
            div.innerHTML = `
              <div style="width: 343px; height: 77px; left: 0; top: 20px; position: relative">
                <div style="width: 400px; height: 50px; padding-bottom: 25px; left: 0px; top: ${Math.floor(i)}px; position: absolute;">
                  <div style="width: 50px; height: 50px; background-image: url('${url}'); background-size: cover; background-position: center center; border-radius: 8px;"></div>
                  <div style="left: 66px; top: 0px; position: absolute; color: black; font-size: 16px; font-family: Inter; font-weight: 700; word-wrap: break-word">${data.name}</div>
                  <div style="left: 280px; top: 2px; position: absolute; text-align: right; color: #BDBDBD; font-size: 14px; font-family: Inter; font-weight: 400; word-wrap: break-word">${data.timestamp} min ago</div>
                  <div style="width: 269px; left: 66px; top: 27px; position: absolute; color: black; font-size: 14px; font-family: Inter; font-weight: 400; word-wrap: break-word">${data.desc}</div>
                  <div style="width: 277px; height: 0px; left: 66px; top: 65px; position: absolute; border: 1px #E8E8E8 solid"></div>
                </div>
              </div>
            `;
            itemList.appendChild(div); // Append the div to the container element
            i++;
          })
          .catch((error) => {
            console.error('Error getting download URL: ', error);
          });
      });
    })
    .catch((error) => {
      console.error('Error getting documents: ', error);
    });

  const userRef = doc(db, 'users', 'JPq8Qzof2VD6pzsX5INi');
  const userStorageRef = storageRef(storage, `profile/${userRef.id}.png`);

  getDoc(userRef)
    .then((docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const nameElement = document.getElementById('name');
        const profileImageElement = document.getElementById('profile-image');
        const email = document.getElementById('email');

        email.textContent = data.email;

        // Update the name element
        nameElement.textContent = data.username;

        // Get the profile image URL from Firebase Storage
        getDownloadURL(userStorageRef)
          .then((url) => {
            // Update the profile image source
            profileImageElement.src = url;
          })
          .catch((error) => {
            // Handle any errors that occurred while retrieving the image URL
            console.error('Error retrieving profile image URL:', error);
          });
      } else {
        // Handle the case when the user document does not exist
      }
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch
      console.error('Error fetching user data:', error);
    });
});
