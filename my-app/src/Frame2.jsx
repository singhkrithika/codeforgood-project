import "./Frame1-2.css";
import cfglogo from "./images/cfglogo_transparent.png";
import home_button from "./images/home_button.png";
import { useState, useEffect } from "react";
import Papa from "papaparse";

function Frame2({ onGoToFrame3 }) {

    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [tableRows, setTableRows] = useState([]);
    const [values, setValues] = useState([]);
    const [nameColumn, setNameColumn] = useState([]);
    const [selectedName, setSelectedName] = useState([]);
  
    // Fetch the list of files from the server
    useEffect(() => {
      fetch("http://localhost:5000/files")
        .then(response => response.json())
        .then(data => {
            setFiles(data);
            if (data.length > 0) {
                // Automatically select the first file when files are fetched
                setSelectedFile(data[0]);
            }
        }) 
        // Save the file to state
        .catch(error => console.error("Error fetching file:", error));
    }, []);
  
    // Automatically load the file on component mount if a file is selected
    useEffect(() => {
        if (selectedFile) {
            fetchFile(selectedFile);
        }
    }, [selectedFile]);

    // Fetch the content of the selected file
    const fetchFile = (filename) => {
      fetch(`http://localhost:5000/uploads/${filename}`)
        .then(response => response.text())
        .then(csvData => {
          Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                const rowsArray = [];
                const valuesArray = [];

                // Iterate through parsed data to extract rows and values
                results.data.forEach((d) => {
                    rowsArray.push(Object.keys(d));
                    valuesArray.push(Object.values(d));
                });
                
                // Find the index of the column that contains "first name"
                const FirstNameIndex = rowsArray[0].findIndex((col) =>
                    col.toLowerCase().includes("first name"));

                let FirstNameData = [];
                if (FirstNameIndex !== -1) {
                    // Extract data from the column found
                    FirstNameData = results.data.map((row) => row[rowsArray[0][FirstNameIndex]]);
                }

                // Find the index of the column that contains "last name"
                const LastNameIndex = rowsArray[0].findIndex((col) =>
                    col.toLowerCase().includes("last name"));

                let LastNameData = [];
                if (LastNameIndex !== -1) {
                    // Extract data from the column found
                    LastNameData = results.data.map((row) => row[rowsArray[0][LastNameIndex]]);
                }

                const full_name = FirstNameData.map((first, index) => `${first} ${LastNameData[index]}`);
                setNameColumn(full_name);

                setTableRows(rowsArray[0]);
                setValues(valuesArray);
            },
          });
        })
        .catch(error => {
          console.error("Error fetching the file:", error);
        });
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

    const deleteFile = () => {
        // Make a fetch request to delete the file on the server
        fetch(`http://localhost:5000/delete-file/${selectedFile}`, {
          method: 'DELETE',
        })
    };

    return (
    <div>
        <nav class="navbar">
            <div class="container-fluid">
              <img class="ps-2 pe-4" height="60" src={cfglogo} alt="Code For Good"/>
              <a href="index" class="home-button" onClick={deleteFile}>
                  <img src={home_button} alt="Button Image"/>
              </a>
            </div>
        </nav>

        <div class="text"> 
            Select Applicant
        </div>
        <div class="input_file"> 
            <select onChange={(e) => setSelectedName(e.target.value)} value={selectedName}>
                <option>Select a Name (Warning: Duplicate names are NOT deleted)</option>
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
    </div>
    );
}

export default Frame2;