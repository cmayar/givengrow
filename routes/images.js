import express from "express";
import db from "../model/helper.js"; // Ensure helper.js uses ES modules too
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import mime from "mime-types";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

router.post("/:id/image", upload.single("imagefile"), async (req, res) => {
  // file is available in req.file
  const { id } = req.params; //item id
  const imagefile = req.file; //upload file

  //verify image is upload
  if (!imagefile) {
    return res.status(400).send({ message: "Image file is required" });
  }

  console.log("THIS IS MY IMAGE FILE", imagefile);

  // check the extension of the file
  const extension = mime.extension(imagefile.mimetype);
  console.log("THIS IS MY EXTENSION", extension);

  // create a new random name for the file
  const filename = uuidv4() + "." + extension;
  console.log("THIS IS MY FILENAME", filename);

  // grab the filepath for the temporary file
  const tmp_path = imagefile.path;

  // construct the new path for the final file
  const target_path = path.join(__dirname, "../public/img/") + filename;
  console.log("Target", target_path);

  try {
    // rename the file
    await fs.rename(tmp_path, target_path);

    const imagePath = `img/${filename}`; //image route to store the image in database

    //update image column in table items
    await db(`UPDATE items SET image = ? WHERE id = ?`, [imagePath, id]);
    //  store image in the DB

    //updated item
    const updatedItem = await db(`SELECT * FROM items WHERE id = ?`, [id]);
    if (updatedItem.data.length === 0) {
      return res.status(404).send({ error: "Item not found" });
    }

    res.status(200).send(updatedItem.data[0]);
  } catch (err) {
    console.error("Error handling image upload:", err);
    res.status(500).send(err);
  }
});

export default router;
