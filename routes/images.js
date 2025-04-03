import express from "express";
import db from "../model/helper.js"; // Ensure helper.js uses ES modules too
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import mime from "mime-types";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "public/img/" });

const getImages = async (req, res) => {
  try {
    const results = await db("SELECT * FROM images;");
    res.send(results.data);
  } catch (err) {
    res.status(500).send(err);
  }
};

router.get("/", getImages);

router.post("/", upload.single('imagefile'), async (req, res) => {
  // file is available in req.file
  const imagefile = req.file;
  console.log("THIS IS MY IMAGE FILE", imagefile);

  // check the extension of the file
  const extension = mime.extension(imagefile.mimetype);
  console.log("THIS IS MY EXTENSION", extension);

  // create a new random name for the file  
  const filename = uuidv4() + "." + extension;
  console.log("THIS IS MY FILENAME", filename);

  // grab the filepath for the temporary file
  const tmp_path = imagefile.path

  // construct the new path for the final file
  const target_path = path.join(__dirname, "../public/img/") + filename;

  try {
    // rename the file
    await fs.rename(tmp_path, target_path);

     // store image in the DB
    await db(`INSERT INTO images (path) VALUES ("${filename}");`);

    getImages(req, res);
  } catch (err) {
    res.status(500).send(err);
  }

});

export default router;