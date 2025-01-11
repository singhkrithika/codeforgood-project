import React, { useState } from 'react';
import Frame1 from './Frame1.jsx';
import Frame2 from './Frame2.jsx';
import Frame3 from './Frame3.jsx';
import Frame4 from './Frame4.jsx';
import Frame5 from './Frame5.jsx';

function App() {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [nameColumn, setNameColumn] = useState([]); // To store the list of names
  const [selectedIndex, setSelectedIndex] = useState(null); // To track the selected index
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [tableRows, setTableRows] = useState([]);
  const [values, setValues] = useState([]);
  const [fileName, setFileName] = useState([]);

  const handleFileUpload = () => {
    // Switch to Frame2 when a file is uploaded
    setCurrentFrame(2);
  };

  const handleGoToFrame3 = (rowIndex, tableRowsData, nameColumnData, rowData, valuesData, fileNameData) => {
    setSelectedIndex(rowIndex); // Set the selected index
    setNameColumn(nameColumnData); // Pass the name column
    setSelectedRowData(rowData); // Pass the row data
    setTableRows(tableRowsData); // Pass the table rows {column names of csv}
    setValues(valuesData);
    setFileName(fileNameData);
    setCurrentFrame(3); // Navigate to Frame3
  };

  const handleGoToFrame4 = (rowIndex, tableRowsData, nameColumnData, rowData, valuesData, fileNameData) => {
    setSelectedIndex(rowIndex); // Set the selected index
    setNameColumn(nameColumnData); // Pass the name column
    setSelectedRowData(rowData); // Pass the row data
    setTableRows(tableRowsData); // Pass the table rows {column names of csv}
    setValues(valuesData);
    setFileName(fileNameData);
    setCurrentFrame(4); // Navigate to Frame4
  }

  const appHandleSave = (newRowData, newTableRows) => {
    // Update tableRows to reflect the new structure with added columns
    setTableRows(newTableRows);
    
    // Update the specific row in the `values` array
    const updatedValues = [...values];
    updatedValues[selectedIndex] = newRowData;

    // Update state with new data
    setValues(updatedValues);
    setSelectedRowData(newRowData);
  }

  const goToFrame5 = (fileNameData) => {
    setFileName(fileNameData);
    setCurrentFrame(5);
  }

  return (
    <div>
      {currentFrame === 1 && <Frame1 onFileUpload={handleFileUpload} />}
      {currentFrame === 2 && <Frame2 onGoToFrame3={handleGoToFrame3} />}
      {currentFrame === 3 && selectedRowData && 
        <Frame3
          nameColumn={nameColumn}
          tableRows={tableRows}
          selectedIndex={selectedIndex}
          rowData={selectedRowData}
          values={values}
          selectedFile={fileName}
          onSave={appHandleSave}
          onGoToFrame4={handleGoToFrame4}
          goToFrame5={goToFrame5}
        />
      }
      {currentFrame === 4 && selectedRowData &&
        <Frame4
          nameColumn={nameColumn}
          tableRows={tableRows}
          selectedIndex={selectedIndex}
          rowData={selectedRowData}
          values={values}
          selectedFile={fileName}
          onSave={appHandleSave}
          onGoToFrame3={handleGoToFrame3}
          goToFrame5={goToFrame5}
        />
      }
      {currentFrame === 5 && 
        <Frame5 
          selectedFile={fileName}
        />}
    </div>
  );
}

export default App;