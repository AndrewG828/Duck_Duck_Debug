const express = require('express');
const fs = require('fs');
const path = require('path');
const Code = require('../schemas/code');
const multer = require("multer");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
/**
 * Recursively retrieve all Java files in a directory.
 * @param {string} dir - The starting directory to search.
 * @param {string[]} fileList - The list of Java file paths (accumulator).
 * @returns {string[]} - Array of Java file paths.
 */
function getJavaFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            getJavaFiles(filePath, fileList);
        } else if (path.extname(file) === '.java') {
            fileList.push(filePath);
        }
    });
    return fileList;
}

/**
 * Extract class name and function signatures from Java file content.
 * @param {string} content - The content of the Java file.
 * @returns {object} - Object containing className and functions array.
 */
function extractJavaDetails(content) {
    const classMatch = content.match(/class\s+(\w+)/);
    const className = classMatch ? classMatch[1] : null;

    const functionRegex = /(?:public|private|protected)?\s+\w+\s+(\w+)\s*\(([^)]*)\)/g;
    const functions = [];
    let match;
    while ((match = functionRegex.exec(content)) !== null) {
        functions.push({
            name: match[1],
            signature: `${match[1]}(${match[2]})`,
        });
    }

    return { className, functions };
}

router.post("/scrape-java", upload.array("files"), async (req, res) => {
    try {
      for (const file of req.files) {
        const filePath = file.originalname; // will be like "src/utils/Helper.java"
        const content = file.buffer.toString("utf8");
  
        const { className, functions } = extractJavaDetails(content);
  
        const codeEntry = {
          file_path: filePath,
          file_name: path.basename(filePath),
          file_extension: '.java',
          language: 'Java',
          class_name: className,
          functions,
          content,
          last_modified: new Date(), // no mtime from upload
        };
  
        await Code.findOneAndUpdate(
          { file_path: filePath },
          codeEntry,
          { upsert: true, new: true }
        );
      }
  
      res.json({ message: `${req.files.length} Java files scraped and saved.` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to scrape Java files." });
    }
  });

module.exports = router;
