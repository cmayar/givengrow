import { useState } from "react";
import axios from "axios";
import "./ImageUploader.css";
import "./styles.css";
import defaultImage from "../assets/images/default_image.png";

/**
 * ImageUploader Component
 * A reusable component for uploading/updating images for items
 *
 * @param {number} itemId - The ID of the item to upload image for (required)
 * @param {string} currentImage - Current image path of the item (optional)
 * @param {function} onUploadSuccess - Callback function when upload succeeds (optional)
 */
export default function ImageUploader({ itemId, currentImage, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file selection
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null); // Clear any previous errors
  };

  // Handle file upload
  const onFileUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    if (!itemId) {
      setError("Item ID is required");
      return;
    }

    setUploading(true);
    setError(null);

    // Create a FormData object
    const formData = new FormData();
    formData.append("imagefile", selectedFile);

    try {
      const token = localStorage.getItem("token");

      // Upload to the specific item
      const res = await axios.post(
        `http://localhost:4000/api/images/${itemId}/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Image uploaded successfully:", res.data);

      // Call the success callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(res.data);
      }

      // Clear the file input after upload
      setSelectedFile(null);
      alert("Image uploaded successfully!");
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="uploader-container">
      {currentImage && (
        <div className="current-image-preview">
          <p>Current Image:</p>
          <img
            src={currentImage ? `http://localhost:4000${currentImage.startsWith('/') ? currentImage : `/${currentImage}`}` : defaultImage}
            alt="Current item"
            style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
          />
        </div>
      )}

      <div className="upload-controls">
        <input
          className="upload-input"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          disabled={uploading}
        />
        <button
          className="upload-button"
          onClick={onFileUpload}
          disabled={!selectedFile || uploading}
        >
          {uploading ? "Uploading..." : "Upload New Image"}
        </button>
      </div>

      {selectedFile && (
        <p className="selected-file-info">
          Selected: {selectedFile.name}
        </p>
      )}

      {error && (
        <p className="error-message" style={{ color: "red" }}>
          {error}
        </p>
      )}
    </div>
  );
}
