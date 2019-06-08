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

const params = new URLSearchParams(window.location.search);
const dogId = params.get("id");

const database = firebase.database();
let ref;

const last = { };

function onClick(prefix) {
  return () => {
    const now = new Date();
    if ($("manualEntry").checked) {
      $("manualPopup").style.visibility = "";
      
      $("manualTime").addEventListener("input", e => 
        $("setManualTime").disabled = !Boolean(e.target.value.length));
      $("setManualTime").onclick = () => {
        const text = $("manualTime").value;
        $("manualTime").value = "";
        const [h, m] = text.split(":").map(s => +s);
        const mins = h * 60 + m;
        const nowMins = now.getHours() * 60 + now.getMinutes();
        const diff = nowMins - mins;
        const pastMins = diff < 0 ? 24 * 60 + diff : diff;
        const pastStamp = now.getTime() - pastMins * 60 * 1000;
        $("manualPopup").style.visibility = "hidden";
        setMillis(prefix, pastStamp);
      }
    } else {
      setMillis(prefix, now.getTime());
    }
  }
}

function setMillis(prefix, newMillis) {
  const oldMillis = last[prefix];
  const prefixRef = database.ref(`${dogId}/${prefix}`);
  prefixRef.set(newMillis, () => {
    const undo = $(`undo${prefix}`);
    if (undo.style.visibility === "" || !oldMillis) {
      return;
    }
    
    const timer = setTimeout(() => undo.style.visibility = "hidden", 5000);
    undo.onclick = () => {
      prefixRef.set(oldMillis);
      undo.style.visibility = "hidden";
      clearTimeout(timer);
    };
    undo.style.visibility = "";
  });
}

function init(prefix) {
  $(prefix).onclick = onClick(prefix);

  ref.on("value", snapShot => {
    const val = snapShot.val();
    if (val) {
      last[prefix] = val[prefix];
    }
  });
  
  setInterval(() => {
    if (!last[prefix]) {
      return;
    }
    const millis = new Date().getTime() - last[prefix];
    let minutes = Math.floor(millis / 60000);
    const hours = Math.floor(minutes / 60);
    minutes %= 60;
    minutes = minutes.toString();
    if (minutes.length === 1) {
      minutes = "0" + minutes;
    }
    $(`${prefix}time`).textContent = `${hours}:${minutes}`;
  }, 1);
}

window.onload = () => {
  if (dogId) {
    ref = database.ref(dogId);
    init("walk");
    init("poo");
    ref.once("value", snapshot => {
      const val = snapshot.val();
      $("name").textContent = val ? val.name : "MissingNo";
    });
  } else {
    $("add").style.visibility = "";
    const newId = Math.random().toString(36).substring(2);

    $("addName").addEventListener("input", e => 
      $("addDog").disabled = !Boolean(e.target.value.length));
    $("addDog").onclick = () => {
      database.ref(newId).set({
        name: $("addName").value,
      }, err => {
        if (err) {
          alert("Write failure: " + error.toString());
        } else {
          const url = new URL(window.location);
          url.searchParams.set("id", newId);
          window.location.replace(url.toString());
        }
      });
    }
  }
  
  $("aboutLink").onclick = () => $("about").style.visibility = "";
  $("about").onclick = () => $("about").style.visibility = "hidden";
};

