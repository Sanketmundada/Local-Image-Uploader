const express = require("express");
const multer = require("multer");
const path = require("path");
const ejs = require("ejs");

//Set Storage Engine
//field name is the name put in input file tag....in this case myImage
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("myImage");

function checkFileType(file, cb) {
  //Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;

  //Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  //check the mimetype
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb("Error: Images Only !!!");
  }
}

//Init app
const app = express();

//EJS Setup

app.set("view engine", "ejs");

//Public Folder

app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", (req, res) => {
  //res.send("jii");
  upload(req, res, (err) => {
    if (err) {
      res.render("index", {
        msg: err,
      });
    } else {
      if (req.file === undefined) {
        res.render("index", {
          msg: "Error: No File Selected",
        });
      } else {
        res.render("index", {
          msg: "File Uploaded",
          file: `uploads/${req.file.filename}`,
        });
      }
    }
  });
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
