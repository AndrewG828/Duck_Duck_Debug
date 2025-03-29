const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    file_path: { type: String, required: true, unique: true }, // Unique file path
    file_name: { type: String, required: true }, // Name of the file
    file_extension: { type: String, required: true }, // File extension (e.g., .java, .js, .py)
    language: { type: String, required: true }, // Programming language (e.g., Java, JavaScript)
    class_name: { type: String }, // Class name (if applicable)
    functions: [{ name: String, signature: String }], // Extracted functions
    content: { type: String, required: true }, // Full file content
    last_modified: { type: Date, default: Date.now }, // Timestamp of last modification
});

const Code = mongoose.model('Code', codeSchema);

module.exports = Code;