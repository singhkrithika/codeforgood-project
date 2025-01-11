import "./Frame3-4.css";
import cfglogo from "./images/cfglogo_transparent.png";
import home_button from "./images/home_button.png";
import React, { useState, useEffect } from "react";

{/*Same functionality as Frame3 but just a different frame*/}
function Frame4({ selectedIndex, tableRows, nameColumn, rowData, values, selectedFile, onSave, onGoToFrame3, goToFrame5 }) {

    const [score, setScore] = useState("");
    const [notes, setNotes] = useState("");
    const [updatedTableRows, setUpdatedTableRows] = useState([...tableRows]);
    const [updatedRowData, setUpdatedRowData] = useState([...rowData]);
    const [selectedName, setSelectedName] = useState("");
    const [fileName, setFileName] = useState(selectedFile);

    useEffect(() => {
        // Check for "Score" and "Notes" columns in tableRows
        let newTableRows = [...tableRows];
        let newRowData = [...rowData];
    
        if (!tableRows.includes("Score")) {
            newTableRows.push("Score"); // Add "Score" column
            newRowData.push(""); // Initialize empty score for the current row
        }
    
        if (!tableRows.includes("Notes")) {
            newTableRows.push("Notes"); // Add "Notes" column
            newRowData.push(""); // Initialize empty notes for the current row
        }
    
        setUpdatedTableRows(newTableRows);
        setUpdatedRowData(newRowData);
    
        // Pre-fill input boxes with existing data
        const scoreIndex = newTableRows.indexOf("Score");
        const notesIndex = newTableRows.indexOf("Notes");
        if (scoreIndex !== -1) setScore(newRowData[scoreIndex]);
        if (notesIndex !== -1) setNotes(newRowData[notesIndex]);
    }, [tableRows, rowData]);
    
    const handleSave = () => {
        // Update rowData with the new values
        const newRowData = [...updatedRowData];
        newRowData[updatedTableRows.indexOf("Score")] = score;
        newRowData[updatedTableRows.indexOf("Notes")] = notes;

        onSave(newRowData, updatedTableRows); // Save updated data to parent state
    };

    const handleGo = () => {
        // Find the index of the selected name in the nameColumn array
        const selectedIndex = nameColumn.findIndex((name) => name === selectedName);
    
        // Get the corresponding row's data from the values array
        const rowData = values[selectedIndex];
    
        if (rowData) {
            onGoToFrame3(
                selectedIndex, 
                tableRows, 
                nameColumn, 
                rowData, 
                values, 
                selectedFile
            );
        } else {
            alert("Please select a valid name.");
        }
    };

    const handleFinish = () => {
        fetch("http://localhost:5000/save-csv", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                filename: fileName, // Use the dynamic file name
                tableRows, 
                values 
            }),
        })
        .then((response) => {
            if (response.ok) {
                alert("File saved successfully!");
                goToFrame5(fileName);
            } else {
                alert("Failed to save the file.");
            }
        })
        .catch((error) => {
            console.error("Error saving the file:", error);
            alert("An error occurred while saving the file.");
        });
    };

    const deleteFile = () => {
        // Make a fetch request to delete the file on the server
        fetch(`http://localhost:5000/delete-file/${fileName}`, {
            method: 'DELETE',
        })
    };

    function extractGoogleDriveId(link) {
        const regex = /(?:\/d\/|id=)([a-zA-Z0-9-_]+)/;
        const match = link.match(regex);
        return match ? match[1] : null;
      }

    if (!rowData || selectedIndex === null || !tableRows) {
        return <div>No data available.</div>;
    }

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

        <div class="frame4-container">
            {/* Display the selected name prominently */}
            <h1 id="applicant-name">{nameColumn[selectedIndex]}</h1>

            <h1 id="resume">Resume:</h1>
            <div class="resume_border">
                {tableRows.map((columnName, index) => {
                    if (columnName.includes("resume")) {
                        if (rowData[index].includes("drive.google.com")) {
                            const ID = extractGoogleDriveId(rowData[index]);
                            return (
                                <iframe 
                                key={index} 
                                src={`https://drive.google.com/file/d/${ID}/preview`} 
                                width="800" 
                                height="484"
                                style={{ border: "none" }}></iframe>
                            );
                        } else {
                            return <p id="resume-alt">Applicant has no resume</p>
                        }
                    }
                })}
            </div>

            {/* Table displaying the details */}
            <h1 id="resume">Applicant Details:</h1>
            <table class="details-table">
                <tbody>
                    {tableRows.map((columnName, index) => (
                        <tr key={index}>
                            <th>{columnName}</th> {/* Column name */}
                            <td>{rowData[index]}</td> {/* Corresponding value */}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Input boxes for Score and Notes */}
            <div className="input-container">
              <label htmlFor="score-input">Score:</label>
              <input
                id="score-input"
                type="text"
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />

              <label htmlFor="notes-input">Notes:</label>
              <textarea
                id="notes-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Save Button */}
            <button onClick={handleSave} className="save-button">
                Save
            </button>

            {/* Swtiching Applicant*/}
            <div class="switch_applicant_text"> 
                Select Different Applicant
            </div>
            <div class="input_file"> 
                <select onChange={(e) => setSelectedName(e.target.value)} value={selectedName}>
                    <option>Select a Name</option>
                    {nameColumn.map((name, index) => (
                        <option key={index} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>
            <div class="upload">
                <button onClick={handleGo}>Go</button>
            </div>
            <div class="finish">
                <button onClick={handleFinish}>Finished</button>
            </div>
        </div>
    </div>
    );
}

export default Frame4;