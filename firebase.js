
const firebaseConfig = {
  apiKey: "AIzaSyCjL3BLN1nP2LTN5wqJgD1XXI3Su5rA29E",
  authDomain: "lancerhacks-v.firebaseapp.com",
  projectId: "lancerhacks-v",
  storageBucket: "lancerhacks-v.appspot.com",
  messagingSenderId: "827587318932",
  appId: "1:827587318932:web:41ccd2beeccebd994cd081",
  measurementId: "G-CMMDSCJFEP"
};

/*
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
var database= app.firestore();*/

firebase.initializeApp(firebaseConfig);
firebase.analytics();
var database= firebase.firestore()


document.getElementById('uploadPhotoForm').addEventListener('submit', submitForm);

 var AuthUID;

//Create a new document in the database and save text entries in there
function submitForm(e){
    e.preventDefault(); //STOPS the from from auto clearing before uploading to the database
    AuthUID= submitFields();
    console.log(AuthUID);
    saveImageToStorage(AuthUID);
    
}


function submitFields(){
    var newUserRef = database.collection("Individual Photos").doc(); //saves UID for later
  newUserRef.set({ //create fields and set it to what you want it set to
    photoTheme: getInputVal('PhotoTheme'),
  })
  return newUserRef.id; //returns generated UID
}



function getInputVal(id){
  return document.getElementById(id).value;
}

function saveImageToStorage(UserUID){
    //Get the uploaded image
    var file = document.getElementById('ImageFile').files[0];
    var nameOfStorageUploadSpace= UserUID+'/image';

    var storageRef = firebase.storage().ref();
    // Upload file to the object 'UserUID/nameOfFile'
    var uploadTask = storageRef.child(nameOfStorageUploadSpace).put(file);

// Listen for state changes, errors, and completion of the upload.
uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    document.getElementById("updates").innerHTML='Upload is ' + progress + '% done';
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        document.getElementById("updates").innerHTML='Upload is paused';
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        document.getElementById("updates").innerHTML='Upload is running';
        break;
    }
  }, 
  (error) => {
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        document.getElementById("updates").innerHTML="Unauthorized access to upload";
        break;
      case 'storage/canceled':
        document.getElementById("updates").innerHTML="Upload canceled";
        break;

      // ...

      case 'storage/unknown':
        document.getElementById("updates").innerHTML="An unknown error occurred";
        break;
    }
  }, 
  () => {
    // Upload completed successfully, now we can get the download URL
    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
      document.getElementById("updates").innerHTML='File available at '+ downloadURL;
      database.collection("Individual Photos").doc(UserUID).update({
               imageURL: downloadURL
        }) //end of database/collection*/
    });
  }
);
}

function read(){
  //Reading from database: 
database.collection("Individual Photos").where("photoTheme", "==", "Animals")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            var info=doc.data();
            var userUID= doc.id;
            var theme=info.photoTheme;
            var url=info.imageURL;
            //append info into the code
            var paraNew = document.createElement("div");
            //paraNew.setAttribute("class", "AllProjects_Div");
            var codeBlock2 =
          ` <div class="` + userUID+ ` outerDivForEach">
        <img class="` + userUID+ ` indivNFT" src="`+ url + `" alt="` + theme + ` Photo">
        </div> `;
        paraNew.innerHTML = codeBlock2 ;
        divToAppend.appendChild(paraNew); 
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });



}


