const express = require("express");
const app = express();
const cors = require("cors");

const port = 5000;

app.use(cors());
app.use(express.json());

const multer = require("multer");
const firebase = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const firebaseConfig = {
  apiKey: "AIzaSyCtt1uX58xiZmeWsosbv8uMIy_O21ZFHgg",
  authDomain: "blackandbelonging-55551.firebaseapp.com",
  projectId: "blackandbelonging-55551",
  storageBucket: "blackandbelonging-55551.appspot.com",
  messagingSenderId: "174231739579",
  appId: "1:174231739579:web:5d0094daadb0256be61d9e",
  measurementId: "G-CZETJQTF1E",
};

firebase.initializeApp(firebaseConfig);
const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) {
    res.status(400).send("no file upload");
    return;
  }
  const StorageRef = ref(storage, req.file.originalname);
  const metadata = {
    contentType: "video/mp4",
  };
  uploadBytes(StorageRef, req.file.buffer, metadata).then(() => {
    getDownloadURL(StorageRef)
      .then((url) => {
        res.status(200).send({
          video: url,
          success: true,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          error: err,
          success: false,
        });
      });
  });
});

app.listen(port, () => {
  console.log(`listen on ${port}`);
});
