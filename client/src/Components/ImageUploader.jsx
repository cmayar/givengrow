import { useState, useEffect } from "react";
import axios from "axios";

export default function Images() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    getImages();
  }, []);

  async function getImages() {
    try {
      const res = await axios.get("/api/images");
      setImages(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  // On file select (from the pop up)
  const onFileChange = (event) => {
    // Update the state
    console.log(event);
    setSelectedFile(event.target.files[0]);
  };

  // On file upload (click the upload button)
  const onFileUpload = async () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("imagefile", selectedFile, selectedFile.name);

    try {
      // Request made to the backend api
      // Send formData object
      const res = await axios.post("/api/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res);
      setImages(res.data);
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="App">
    <h3>Select file to upload:</h3>
    <input type="file" onChange={onFileChange} />
    <button onClick={onFileUpload}>Upload</button>

    <div>
      {images.map((image) => (
        <img key={image.id} src={`/img/${image.path}`} />
      ))}
    </div>
  </div>
);
}
