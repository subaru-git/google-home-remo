require('dotenv').config()
const remo = require('./remo')
var firebase = require("firebase");

var config = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID
};

firebase.initializeApp(config);

var db = firebase.database();
var ref = db.ref("/");

ref.on("child_changed", function (changedSnapshot) {
  const l = changedSnapshot.val();
  console.log(`light ${l}`);
  let done = true;
  if (l === "true") {
    done = remo.lightOn()
  } else if (l === "false") {
    done = remo.lightOff()
  }
  ref.update({
    light: "wait"
  })
});