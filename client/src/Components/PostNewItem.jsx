// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import ImageUploader from "./ImageUploader"; // Assuming this is where you're uploading images
// import "./PostNewItem.css";

// function PostNewItemPage() {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   // const [imageFile, setImageFile] = useState(null); // Store the file here
//   const [error, setError] = useState(null);

//   const categories = [
//     "tools",
//     "outdoor",
//     "kitchenware",
//     "cleaning",
//     "electronics",
//     "sports",
//     "furniture",
//     "events",
//     "childrens",
//     "seasonal",
//     "crafts",
//     "media",
//     "vehicles",
//     "misc",
//   ];

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title || !description || !category) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("Please log in before posting an item.");
//         return;
//       }

//       // Send plain JSON, not FormData
//       const body = {
//         title,
//         description,
//         category,
//         status: "available",
//       };

//       const response = await axios.post(
//         "http://localhost:4000/api/items",
//         body,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json", // important!
//           },
//         }
//       );

//       console.log("Item created:", response.data);
//       alert("Item successfully created!");
//       setTitle("");
//       setDescription("");
//       setCategory("");
//       navigate("/dashboard"); // optional
//     } catch (err) {
//       console.error("Error creating item:", err);
//       setError("Failed to create item. Please try again.");
//     }
//   };

//   return (
//     <div className="form">
//       <h1 className="title-style">Post New Item</h1>
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <form
//         onSubmit={handleSubmit}
//         // encType="multipart/form-data"
//         className="form"
//       >
//         <label htmlFor="title" className="form-label">
//           Title
//         </label>
//         <input
//           type="text"
//           name="title"
//           id="title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//           className="form-input"
//         />
//         <br />

//         <label htmlFor="description" className="form-label">
//           Description
//         </label>
//         <textarea
//           name="description"
//           id="description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//           className="form-input"
//         />
//         <br />

//         <label htmlFor="category" className="form-label">
//           Category
//         </label>
//         <select
//           name="category"
//           id="category"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           required
//           className="form-input"
//         >
//           <option value="">-- Select --</option>
//           {categories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat.charAt(0).toUpperCase() + cat.slice(1)}
//             </option>
//           ))}
//         </select>
//         <br />

//         {/* <label htmlFor="image" className="form-label">
//           Image
//         </label>
//         <ImageUploader onUpload={handleImageUpload} />
//         <br /> */}

//         <input type="submit" value="Submit" className="form-input" />
//       </form>
//     </div>
//   );
// }

// export default PostNewItemPage;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PostNewItem.css";

function PostNewItemPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const categories = [
    "tools",
    "outdoor",
    "kitchenware",
    "cleaning",
    "electronics",
    "sports",
    "furniture",
    "events",
    "childrens",
    "seasonal",
    "crafts",
    "media",
    "vehicles",
    "misc",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in before posting an item.");
        return;
      }

      const body = {
        title,
        description,
        category,
        status: "available",
      };

      const response = await axios.post(
        "http://localhost:4000/api/items",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Item created:", response.data);
      alert("Item successfully created!");
      setTitle("");
      setDescription("");
      setCategory("");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error creating item:", err);
      const message =
        err.response?.data?.error || "Failed to create item. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="form">
      <h1 className="title-style">Post New Item</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="form-input"
        />

        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="form-input"
        />

        <label htmlFor="category" className="form-label">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="form-input"
        >
          <option value="">-- Select --</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        <input type="submit" value="Submit" className="form-input" />
      </form>
    </div>
  );
}

export default PostNewItemPage;
