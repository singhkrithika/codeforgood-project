const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { format } = require("fast-csv");

const app = express();
const PORT = 5000;

// Enable CORS for React frontend
app.use(cors());

app.use(express.json({ limit: "100mb" }));

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Function to list all files in the 'uploads' folder
app.get("/files", (req, res) => {
  const uploadFolder = path.join(__dirname, "uploads");
  fs.readdir(uploadFolder, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read files" });
    }
    res.json(files); // Send the list of filenames
  });
});

// Configure Multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Save files in the "uploads" folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname); // Add timestamp to filename
    },
  }),
});

// Ensure "uploads" folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// File upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.json({ filename: req.file.filename }); // Respond with the saved file name
});

// Saving Updated CSV Endpoint
app.post("/save-csv", (req, res) => {
  const { filename, tableRows, values } = req.body;

  const filePath = `uploads/${filename}`;
  const writeStream = fs.createWriteStream(filePath);
  
  const csvStream = format({ headers: tableRows, quoteColumns: true }); // Automatically handles quoting

  // Pipe the CSV stream into the write stream
  csvStream.pipe(writeStream)
    .on("finish", () => {
      res.send("File saved successfully");
    })
    .on("error", (err) => {
      console.error("Error saving file:", err);
      res.status(500).send("Failed to save CSV file");
    });

  // Write each row of data into the CSV
  values.forEach((row) => {
    const rowObject = {};
    tableRows.forEach((header, index) => {
      rowObject[header] = row[index] || ""; // Map header to value, default to empty string
    });
    csvStream.write(rowObject);
  });

  csvStream.end(); // Close the stream
});

// Endpoint to delete a file
app.delete("/delete-file/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return res.status(500).send("Failed to delete file");
    }
    res.send("File deleted successfully");
  });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));