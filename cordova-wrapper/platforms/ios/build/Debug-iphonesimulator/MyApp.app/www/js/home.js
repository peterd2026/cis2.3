import { db } from './firebaseConfig.js';
import { getStorage, ref as storageRef, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
  const storage = getStorage(); // Initialize Firebase Storage instance

  getDocs(collection(db, 'items'))
    .then((querySnapshot) => {
      const itemList = document.getElementById('recommendation'); // Get the container element
      let i = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const imageRef = storageRef(storage, `${data.id}.png`); // Construct the reference to the image file

        getDownloadURL(imageRef) // Fetch the URL for the image
          .then((url) => {
            const div = document.createElement('div'); // Create a new div element
            div.innerHTML = `
              <div style="width: 110px; height: 177px; padding-bottom: 25px; left: ${Math.floor(i % 3) * 126}px; top: ${Math.floor(i / 3) * 170 + 45}px; position: absolute;">
              <a href="product_info.html?itemId=${data.id}">
                <div style="width: 110px; height: 110px; background-image: url('${url}'); background-size: cover; background-position: center center; border-radius: 8px;"></div>
                  <div style="top: 120px;position: absolute; width: 110px; color: black; font-size: 14px; font-family: Inter; font-weight: 600; word-wrap: break-word">${data.name}</div>
                  <div style="position:relative; top:32px;width: 110px; color: black; font-size: 14px; font-family: Inter; font-weight: 400; word-wrap: break-word">${data.quantity}</div>
              </a>
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
});
