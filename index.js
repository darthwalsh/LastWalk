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

function onClick(prefix) {
  return () => {
    const newTime = 1 + +$(`${prefix}time`).textContent; // TODO
    database.ref(`${dogId}/${prefix}`).set(newTime);
  }
}

function init(prefix) {
  $(prefix).onclick = onClick(prefix);

  ref.on("value", snapShot =>
    $(`${prefix}time`).textContent = snapShot.val()[prefix]);
}

window.onload = () => {
  init("walk");
  init("poo");
};

