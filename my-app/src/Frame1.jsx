import React, { useState } from "react";
import "./Frame1-2.css";
import cfglogo from "./images/cfglogo_transparent.png";
import home_button from "./images/home_button.png";
import axios from "axios";

function Frame1({onFileUpload}) {
  const [file, setFile] = useState(null); // State to store the selected file

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      console.log("File selected:", files[0].name);
      setFile(files[0]); // Update the state with the selected file
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!file) {
      alert("Please select a file first!");
      return;
    }

    // Notify the parent that a file has been uploaded
    if (onFileUpload) {
      onFileUpload(); // Call the onFileUpload callback from the parent
    }

    const formData = new FormData();
    formData.append("file", file); // Add the file to the form data

    try {
      // Send the file to the backend
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(`File uploaded successfully: ${response.data.filename}`);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed. Please try again.");
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="container-fluid">
          <img className="ps-2 pe-4" height="60" src={cfglogo} alt="Code For Good" />
          <a href="index" className="home-button">
            <img src={home_button} alt="Button Image" />
          </a>
        </div>
      </nav>

      <div className="text">Code For Good Application Reader</div>

      <form onSubmit={handleSubmit}>
        <div className="input_file">
          <input type="file" onChange={handleFileChange} />
        </div>
        <div className="upload">
          <button type="submit">Upload</button>
        </div>
      </form>
    </div>
  );
}

export default Frame1;