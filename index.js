require('dotenv').config()
const remo = require('./remo')
const sensor = require('./sensor')
const cron = require('node-cron')
var firebase = require("firebase-admin");
var serviceAccount = require("./setting/firebase-config.json");

cron.schedule('* * * * *', () => {
  sensor.pushSensor();
});

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASEURL
});

var db = firebase.database();
var ref = db.ref("/");

ref.on("child_changed", function (changedSnapshot) {
  const l = changedSnapshot.val();
  console.log(`light ${l}`);
  if (l === "true") {
    remo.lightOn()
  } else if (l === "false") {
    remo.lightOff()
  }
  ref.update({
    light: "wait"
  })
});