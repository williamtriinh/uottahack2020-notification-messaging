const firebaseAdmin = require("firebase-admin");
const app = require("express")();
const bodyParser = require("body-parser");

const port = 8000;

app.use(bodyParser.json());

let users = {};

var serviceAccount = require("./uottahack2020-firebase-adminsdk-ei9xp-c5f2007adb.json");

const FirebaseApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://uottahack2020.firebaseio.com"
});

// Create the Firebase Messaging instance
const fcm = FirebaseApp.messaging();

let notifyUser = (data) => {
    users[data.id+""] = setInterval(() => {
        notifyUser(req.body);
    }, 86400000);

    const message = {
        notification: {
            title: "Time to take your " + data.drug,
            body: ""
        },
    };

    fcm.sendToDevice(data.token, message).then((res) => {
        console.log(res);
    }).catch((error) => {
        console.log(error);
    });
}

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/add_drug", (req, res) => {
    console.log(req.body);
    const { id, drug, token, time } = req.body;
    let currentTime = new Date();
    let reminderTime = new Date();
    let hour = parseInt(time.toString().split(":")[0]);
    let min = parseInt(time.toString().split(":")[1]);
    reminderTime.setHours(hour, min);

    console.log("Time (MS) :" + (reminderTime.getTime() - currentTime.getTime()));

    users[id] = setInterval(() => {
        notifyUser(req.body);
    }, reminderTime.getTime() - currentTime.getTime()); // 24 hours
})

// let cTime = new Date();
// let nTime = new Date();
// nTime.setHours(09, 25);
// console.log(nTime.getTime() - cTime.getTime());

app.listen(port, () => console.log(`Notification messaging app listening on port ${port}`))


// const token = "ey5nRE94e1w:APA91bHIDbzwSq6KFa13vT4H81rwZc0TT-Oene7RGNVdbgYRd5CCd9EtfK6wnGdfmFrqMFEkqza0cSQnXKFtWo73_MXGOnUQJQe4gNktFXORrfb_NLbV7DaQ_zgnVX0p8TlvdotJqitp";

// const message = {
//     notification: {
//         title: "My title",
//         body: "my body"
//     },
// };

// fcm.sendToDevice(token, message).then((res) => {
//     console.log(res);
// }).catch((error) => {
//     console.log(error);
// });

// let message = {
//     notification: {
//         title: '$GOOG up 1.43% on the day',
//         body: '$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day.',
//     },
//     token: "fiy-BMPEGE4:APA91bGSQJR-jHtiRtg0JvVl9roaUI6zwzK-znAYLvh_wB2qLam9_zg5iyrwWHIvWTRBn50bN_tbmkBF1vnTlVZ18K9Z6MzFyq0XDwsba2hjzS4PkmyWANf2kZCYNUyvlGpbLGyjDN-P",
// }

// fcm.send(message).then((res) => {
//     console.log("Success: " + res);
// }).catch((error) => {
//     console.log("Fail: " + error)
// });
