import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { arrayUnion, arrayRemove, addDoc, setDoc, doc, getDoc, getFirestore, onSnapshot, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

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
  var logged_in_id = "";

  // Initialize Cloud Firestore and get a reference to the service
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  async function uploadToDB(userObject) {
    try {
      const docRef = await setDoc(doc(db, "users", $("#email").val()), userObject);
      console.log("Document written with ID: ", $("#email").val());
      alert("Registered successfully.")
      $("#upload").prop("disabled", false);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  async function getFromDB(type) {
    let docSnap = await getDoc(doc(db, "users", logged_in_id));
    if (type == "teacher") {
      let querySnapshot = await getDocs(query(collection(db, "users"), where("type", "==", type)));
      let partnerCounter = $("<p>", {
        html: "You currently have " + String(docSnap.data().teachers.length) + " teacher(s):<br />"
      });
      partnerCounter.css("font-weight", 700);
      $("#partnerCounter").append(partnerCounter);
      $("#partnerCounter").append($("<br>"));

      docSnap.data().teachers.forEach(async function(email, index) {
        let teacherIdCurrent = docSnap.data().teachers[index];
        let docSnap2 = await getDoc(doc(db, "users", teacherIdCurrent));
        let subheading = docSnap2.data().specialty;
        let nameContainer = $("<div>", {
          id: teacherIdCurrent,
          style: "display:flex; justify-content: flex-start; gap: 10px; align-items: center"
        });
        let avatar_image = $("<img>", {
          src: docSnap2.data().avatar,
          style: "width: 50px; height: 50px; object-fit: cover; border-radius: 50%;"
        })
        let text_container = $("<div>", {
          style: "text-align: left;"
        })
        let name = $("<h3>", {
          style: " text-align: left;",
          html: docSnap2.data().first + " " + docSnap2.data().last
        })
        let subheading_span = $("<span>", {
          html: teacherIdCurrent + "<br />" + subheading
        })

        /*nameContainer.append($("<button>", {
          html: "Chat",
          style: "margin-right: 10px;",
          id: teacherIdCurrent,
          class: "msgRequestButton"
        }))*/

        nameContainer.append(avatar_image);
        text_container.append(name);
        text_container.append(subheading_span);
        nameContainer.append(text_container);

        $("#partnerCounter").append(nameContainer);
        $("#partnerCounter").append($("<br>"));
      })

      querySnapshot.forEach((doc) => {
        if (doc.data().students == null || doc.data().students.includes(logged_in_id) == false) {
          createNewSearchResult(doc, type, "#teachers", true)
        }
        else {

        }
      });
    }
    else {
      let partnerCounter = $("<p>", {
        html: "You currently have " + String(docSnap.data().students.length) + " student(s):<br />"
      })
      partnerCounter.css("font-weight", 700);
      $("#partnerCounter").append(partnerCounter);
      $("#partnerCounter").append($("<br>"));

      docSnap.data().students.forEach(async function(email, index) {
        let studentIdCurrent = docSnap.data().students[index];
        let docSnap2 = await getDoc(doc(db, "users", studentIdCurrent));
        let subheading = docSnap2.data().level;
        let nameContainer = $("<div>", {
          id: studentIdCurrent,
          style: "display:flex; justify-content: flex-start; gap: 10px; align-items: center"
        });
        let avatar_image = $("<img>", {
          src: docSnap2.data().avatar,
          style: "width: 50px; height: 50px; object-fit: cover; border-radius: 50%;"
        })
        let text_container = $("<div>", {
          style: "text-align: left;"
        })
        let name = $("<h3>", {
          style: " text-align: left;",
          html: docSnap2.data().first + " " + docSnap2.data().last
        })
        let subheading_span = $("<span>", {
          html: studentIdCurrent + "<br />" + subheading
        })

        /*nameContainer.append($("<button>", {
          html: "Chat",
          style: "margin-right: 10px;",
          id: teacherIdCurrent,
          class: "msgRequestButton"
        }))*/

        nameContainer.append(avatar_image);
        text_container.append(name);
        text_container.append(subheading_span);
        nameContainer.append(text_container);
        nameContainer.append($("<br>"));

        $("#partnerCounter").append(nameContainer);
        $("#partnerCounter").append($("<br>"));
      })

      if (docSnap.exists()) {
        let requestCounter = $("<p>", {
          html: "You have " + String(docSnap.data().requests.length) + " request(s)."
        })
        $("#requestCounter").append("<br>");
        $("#requestCounter").append(requestCounter);
        docSnap.data().requests.forEach(async function(doc_id) {
          let docReq = await getDoc(doc(db, "users", doc_id));
          if (docReq.exists()) {
            createNewSearchResult(docReq, type, "#teachers", true);
          };
        });
      };
    };
  };

  function createNewSearchResult(doc, type, container, showButton) {
    let subheading = type == "student" ? doc.data().level : doc.data().specialty;
    let container_div = $("<div>", {
      id: doc.id,
      style: "display:flex; justify-content: flex-start; gap: 10px; align-items: center"
    });
    let avatar_image = $("<img>", {
      src: doc.data().avatar,
      style: "width: 50px; height: 50px; object-fit: cover; border-radius: 50%;"
    })
    let text_container = $("<div>", {
      style: "text-align: left;"
    })
    let name = $("<h3>", {
      style: " text-align: left;",
      html: doc.data().first + " " + doc.data().last
    })
    let subheading_span = $("<span>", {
      html: doc.id + "<br />" + subheading
    })

    $(container).append(container_div);

    if (showButton == true) {
      let requestButton = $("<button>", {
        html: type == "student" ? "Accept" : "Request",
        id: doc.data().first,
        class: type == "student" ? "acceptButton" : "requestButton"
      })
      container_div.append(requestButton);
    }
    container_div.append(avatar_image);
    container_div.append(text_container);
    text_container.append(name);
    text_container.append(subheading_span);
    $(container).append($("<br>"));
  }

  async function verifyFromDB(id) {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if ($("#login_pass").val() != docSnap.data().pass) {
      alert("Incorrect password!")
      $("#login_upload").prop("disabled", false);
    }
    else {
      logged_in_id = id;
      $("#login").css("display", "none");
      $("#logged_in_avatar").attr("src", docSnap.data().avatar)
      $("#hello").html("Hello, " + docSnap.data().first + ".");
      $("#loggedinas").html("Logged in as " + id + ".<br />This website is only a proof-of-concept; refresh to log out.");
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
  }

  async function matchFromDB(string) {
    let firestoreDoc = await getDoc(doc(db, "users", string));
    return firestoreDoc.exists();
  }

  $("#login_upload").click(async function() {
    if ($("#login_email").val().replace(/\s/g,'') != "")
      $("#login_upload").prop("disabled", true);
      if (await matchFromDB($("#login_email").val()) == true) {
        verifyFromDB($("#login_email").val());
      }
      else {
        alert("Email does not exist!")
        $("#login_upload").prop("disabled", false);
      };
  });

  $("#refresh").click(function() {
    $("#requestCounter").html("");
    $("#partnerCounter").html("");
    $("#teachers").html("");
    getFromDB(requestedRegisType);
  });
  /*
  $("body").on("click", ".msgRequestButton", async function() {
    let chatBox = $("<div>", {
      class: "section"
    })

    let form = $("<form>", {
      style: "display: flex;"
    })

    let msgBox = $("<input>", {
      type: "text",
      placeholder: "Type a message..."
    })

    let msgButton = $("<button>", {
      html: "Send"
    })

    form.append(msgBox);
    form.append(msgButton);


    chatBox.append($("<h3>", {
      html: $(this).next().html()
    }))
    chatBox.append(form);

    chatBox.insertAfter("#navBar");
    $("<br>").insertAfter(chatBox)
  })
  */
  $("#teachers").on("click", ".requestButton", async function() {
    let target_email = $(this).parent().attr("id")
    if (confirm("Send a request to " + $(this).attr("id") + " (" + target_email + ")?")) {
      let docRef = doc(db, 'users', target_email);
      let docSnap = await getDoc(docRef);
      if (docSnap.data().requests.includes(logged_in_id)) {
        alert("You have already sent a request to this instructor before.");
      }
      else {
        await setDoc(docRef, {requests: arrayUnion(logged_in_id)}, {merge: true});
        alert("Request sent!")
      }
    }
  })

  $("#teachers").on("click", ".acceptButton", async function() {
    let target_email = $(this).parent().attr("id")
    if (confirm("Accept request from " + $(this).attr("id") + " (" + target_email + ")?")) {
      let docRef2 = doc(db, 'users', target_email);
      await setDoc(docRef2, {teachers: arrayUnion(logged_in_id)}, {merge: true});

      let docRef = doc(db, 'users', logged_in_id);
      await setDoc(docRef, {requests: arrayRemove(target_email)}, {merge: true});
      await setDoc(docRef, {students: arrayUnion(target_email)}, {merge: true});
      alert("Request accepted!")
      $("#refresh").click();
    }
  })

  $("#upload").click(function() {
    $("#upload").prop("disabled", true);
    let avatar_url = $("#url").val().replace(/\s/g,'') != "" ? $("#url").val().replace(/\s/g,'') : 'img/avatar.png'
    $.get(avatar_url)
    .done(async function() {
      if ($("#fname").val() == "" || $("#lname").val() == "" || $("#pass").val() == "" || $("#pass").val() != $("#confirmpass").val()) {
        $("#upload").prop("disabled", false);
        alert("Error processing registration. Forms might be incomplete or passwords might not match.")
      }
      else if ($("#datapriv").prop("checked") == false) {
        $("#upload").prop("disabled", false);
        alert("Docer requires the processing of your personal data for its services. Please tick the checkbox before continuing.")
      }
      else if (await matchFromDB($("#email").val()) == true) {
        $("#upload").prop("disabled", false);
        alert("That email has already been registered.")
      }
      else {
        let userObject = {
          first: $("#fname").val(),
          last: $("#lname").val(),
          pass: $("#pass").val(),
          type: $("#regisType").val(),
          avatar: avatar_url
        }
        if ($("#regisType").val() == "teacher") {
          userObject.specialty = $("#specialty").val();
          userObject.students = [];
          userObject.requests = [];
        }
        else {
          userObject.level = $("#level").val()
          userObject.teachers = [];
        }
        uploadToDB(userObject);
      }
    }).fail(function() {
        alert("Failed to load profile picture from URL. Leave it blank to use the default profile picture.")
    });
  });
})
