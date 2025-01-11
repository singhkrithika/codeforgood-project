import "./Frame5.css";
import cfglogo from "./images/cfglogo_transparent.png";
import home_button from "./images/home_button.png";
import React, { useState, useEffect } from "react";

function Frame5({ selectedFile }) {

    const [fileName, setFileName] = useState(selectedFile);

    const deleteFile = () => {
        // Make a fetch request to delete the file on the server
        fetch(`http://localhost:5000/delete-file/${fileName}`, {
            method: 'DELETE',
        })
    };

    return(
    <div>
        <nav class="navbar">
            <div class="container-fluid">
                <img class="ps-2 pe-4" height="60" src={cfglogo} alt="Code For Good"/>
                <a href="index" class="home-button" onClick={deleteFile}>
                    <img src={home_button} alt="Button Image"/>
                </a>
            </div>
        </nav>

        <div class="text">Thanks for your hard work!</div>
        <div class="subtext">After downloading, please click the homepage button or icon to delete the file and maintain security!</div>

        <a href={`http://localhost:5000/uploads/${fileName}`} download>
            <button>
                Download Annotated File
            </button>
        </a>

        <a href="index">
            <button onClick={deleteFile}>
                Homepage
            </button>
        </a>

    </div>
    );
}

export default Frame5;