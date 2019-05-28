var firebaseConfig = {
  apiKey: "AIzaSyD5dGDgA23L_4tlJqZeuWEMuKoq4IBe0yE",
  authDomain: "last-walk.firebaseapp.com",
  databaseURL: "https://last-walk.firebaseio.com",
  projectId: "last-walk",
  storageBucket: "last-walk.appspot.com",
  messagingSenderId: "711055835479",
  appId: "1:711055835479:web:bfe62c07fca24517"
};
firebase.initializeApp(firebaseConfig);

function $(id) {
  return document.getElementById(id);
}

const params = new URLSearchParams(location.search);
if (!params.get("id")) {
  alert("Missing '?id=...' in URL!");
}
const dogId = params.get("id")

const database = firebase.database();
const ref = database.ref(`${dogId}`);
const walkRef = database.ref(`${dogId}/walk`);

function walkClick() {
  const newTime = 1 + +$("walktime").textContent; // TODO
  walkRef.set(newTime);
}

window.onload = () => {
  $("walk").onclick = walkClick;

  ref.on("value", snapShot => $("walktime").textContent = snapShot.val().walk);
};

