import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PostItemPage() {
  const [itemData, setItemData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const categories = [
    "tools", "outdoor", "kitchenware", "cleaning", "electronics",
    "sports", "furniture", "events", "childrens", "seasonal",
    "crafts", "media", "vehicles", "misc"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setItemData((prevData) => ({ ...prevData, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", itemData.title);
    formData.append("description", itemData.description);
    formData.append("category", itemData.category);
    formData.append("image", itemData.image);

    try {
      await axios.post("http://localhost:4000/items", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      navigate("/home");
    } catch (err) {
      console.error("Failed to post item:", err);
      setError(err.response?.data?.message || "Failed to post item.");
    }
  };

  return (
    <div>
      <h1>Post a New Item</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          name="title"
          id="title"
          value={itemData.title}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="description">Description:</label>
        <textarea
          name="description"
          id="description"
          value={itemData.description}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="category">Category:</label>
        <select
          name="category"
          id="category"
          value={itemData.category}
          onChange={handleChange}
          required
        >
          <option value="">-- Select --</option>
          {/* LOCATION THING- NOT BOTHERING WITH IT? */}
          {/* {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))} */}
        </select>
        <br />

        <label htmlFor="image">Image:</label>
        {/* IMAGE UPLOADER BY FATIMA */}

        <input type="submit" value="Post Item" />
      </form>
    </div>
  );
}

export default PostItemPage;
