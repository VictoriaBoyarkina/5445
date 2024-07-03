import express from "express";
import webpush from "web-push";

const router = express.Router();

const dummyDb = { subscriptions: [] }; // dummy in memory store
const saveToDatabase = async (subscription) => {
  // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
  // Here you should be writing your db logic to save it.
  dummyDb.subscriptions.push(subscription);
};

const VAPID_KEYS = {
  publicKey: process.env.PUBLIC_VAPID_KEY,
  privateKey: process.env.PRIVATE_VAPID_KEY,
};

// The new /save-subscription endpoint
router.post("/save-subscription", async (req, res) => {
  const subscription = req.body;
  await saveToDatabase(subscription); // Method to save the subscription to Database
  console.log("save sub\n\r", subscription);
  res.json({ message: "success" });
});

// setting our previously generated VAPID keys
webpush.setVapidDetails(
  "mailto:myuserid@email.com",
  VAPID_KEYS.publicKey,
  VAPID_KEYS.privateKey
);

// function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend) => {
  webpush.sendNotification(subscription, dataToSend);
};

// route to test send notification
router.post("/send-notification", (req, res) => {
  const reqBody = req.body || {};
  const {
    title = "default title",
    body = "",
    icon = "",
    link,
    actionLinkFirst,
    actionLinkSecond,
  } = reqBody;
  const message = {
    title,
    body,
    icon,
    data: {
      link,
      actionLinkFirst,
      actionLinkSecond,
    },
  };

  const subscriptions = dummyDb.subscriptions; // get subscription from your database here.

  subscriptions.forEach((sub) => {
    sendNotification(sub, JSON.stringify(message));
  });
  res.json({ message: "message sent" });
});

export { router as notificationsRouter };
