import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { addDoc, setDoc, doc, getDoc, getFirestore, onSnapshot, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

$(document).ready(function() {
  const firebaseConfig = {
    apiKey: "AIzaSyCbMU35FfyxF_ReNWFidZcGZNisA0v1E18",
    authDomain: "docer-c8dba.firebaseapp.com",
    projectId: "docer-c8dba",
    storageBucket: "docer-c8dba.appspot.com",
    messagingSenderId: "271719760711",
    appId: "1:271719760711:web:9272c6b11d9d5265ce8262",
    measurementId: "G-PJ184MCL0L"
  };

  var requestedRegisType = "student";

  // Initialize Cloud Firestore and get a reference to the service
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  async function uploadToDB(userObject) {
    try {
      const docRef = await setDoc(doc(db, "users", $("#email").val()), userObject);
      console.log("Document written with ID: ", $("#email").val());
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  async function getFromDB(type) {
    const querySnapshot = await getDocs(query(collection(db, "users"), where("type", "==", type)));
    querySnapshot.forEach((doc) => {
      $("#teachers").html(
        doc.data().first + " " + doc.data().last + "<br />" + $("#teachers").html()
      )
    });
  };

  async function verifyFromDB(id) {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      if ($("#login_pass").val() != docSnap.data().pass) {
        alert("Incorrect password!")
      }
      else {
        $("#login").css("display", "none");
        $("#hello").html("Hello, " + docSnap.data().first);
        $("#loggedinas").html("Logged in as " + id);
        if (docSnap.data().type == "teacher") {
          requestedRegisType = "student";
          $("#registereds").html("Searching for registered students...");
        }
        else {
          requestedRegisType = "teacher"
          $("#registereds").html("Searching for registered teachers");
        }
        $("#welcome").css("display", "block");
        $("#results").css("display", "block");
        $("#refresh").click();
      };
    };
  }

  async function matchFromDB(string) {
    let firestoreDoc = await getDoc(doc(db, "users", string));
    return firestoreDoc.exists();
  }

  $("#upload").click(async function() {
    console.log($("#regisType").val())
    if ($("#fname").val() == "" || $("#lname").val() == "" || $("#pass").val() == "" || $("#pass").val() != $("#confirmpass").val()) {
      alert("finish the form dumbass")
    }
    else if (await matchFromDB($("#email").val()) == true) {
      alert("o shit email exists")
    }
    else {
      let userObject = {
        first: $("#fname").val(),
        last: $("#lname").val(),
        pass: $("#pass").val(),
        type: $("#regisType").val(),
      }
      if ($("#regisType").val() == "teacher") {
        userObject.specialty = $("#specialty").val()
      }
      uploadToDB(userObject);
    }
  });

  $("#login_upload").click(async function() {
    if (await matchFromDB($("#login_email").val()) == true) {
      verifyFromDB($("#login_email").val());
    }
  })

  $("#refresh").click(function() {
    $("#teachers").html("");
    getFromDB(requestedRegisType);
  });
})
