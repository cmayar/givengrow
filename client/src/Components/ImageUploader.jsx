import { useState, useEffect } from "react";
import axios from "axios";
import "./ImageUploader.css";
import "./styles.css";

export default function ImageUploader({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    getImages();
  }, []);

  // Fetch images from the server
  async function getImages() {
    try {
      const res = await axios.get("/api/images");
      setImages(res.data);
      // If an image was uploaded recently, send the latest one to the parent
      if (res.data.length > 0 && onUpload) {
        const uploadedImagePath = res.data[res.data.length - 1]?.path;
        onUpload(res.data[res.data.length - 1]); // Send the full image object to parent
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Handle file selection
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // Set the selected file
  };

  // Handle file upload
  const onFileUpload = async () => {
    if (!selectedFile) {
      console.log("No file selected");
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append("imagefile", selectedFile, selectedFile.name);

    try {
      // Send the file to the backend
      const res = await axios.post("/api/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res);
      setImages(res.data); // Update the image list after upload

      // Send the uploaded image to the parent component
      if (onUpload) {
        onUpload(res.data[res.data.length - 1]); // Send the newly uploaded image object to parent
      }

      // Clear the file input after upload
      setSelectedFile(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="uploader-container">
      <input className="upload-input" type="file" onChange={onFileChange} />
      <button className="upload-button" onClick={onFileUpload}>Upload</button>

      <div className="img-gallery">
        {images.map((image) => (
          <img key={image.id} src={`/${image.path}`} alt={image.path} />
        ))}
      </div>
    </div>
  );
}
