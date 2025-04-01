# Duck Duck Debug
Duck Duck Debug is an AI-powered debugging assistant designed to make debugging more interactive and intuitive. Inspired by rubber duck debugging, it listens as you verbally walk through your code and provides relevant insights, guiding questions, and code context to help you solve issues and better understand your codebase.

Features
Voice-Based Debugging: Explain your code out loud, and Duck Duck Debug will analyze and respond.

Context-Aware Suggestions: Automatically retrieves relevant code snippets from your codebase to provide useful insights.

AI-Driven Guidance: Uses Retrieval-Augmented Generation (RAG) to help you understand and resolve bugs.

Speech-to-Text & Text-to-Speech: Converts voice input to text using OpenAI Whisper and responds using ElevenLabs.

Animated Debugging Interface: Smooth UI experience built with React.

Tech Stack
Machine Learning: BERT (trained on CoNaLa dataset)

AI Framework: Retrieval-Augmented Generation (RAG), OpenAI API

Speech Processing: Whisper (speech-to-text), ElevenLabs (text-to-speech)

Database: MongoDB

Backend: Express

RAG Microservices: Python

Frontend: React

APIs & Libraries: LangChain, OpenAI, ElevenLabs

Getting Started
Prerequisites
Python 3.8+: Install from python.org

Node.js 16+: Install from nodejs.org

MongoDB: Install from mongodb.com

Installation
Clone the Repository

bash
Copy
Edit
git clone https://github.com/yourusername/duck-duck-debug.git
cd duck-duck-debug
Set Up Environment Variables
Create a .env file in the root directory with the following:

plaintext
Copy
Edit
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret_key
PORT=5000
Install Backend Dependencies

bash
Copy
Edit
cd backend
pip install -r requirements.txt
Install Frontend Dependencies

bash
Copy
Edit
cd ../frontend
npm install
Start the Backend Server

bash
Copy
Edit
cd backend
python app.py
Start the Frontend

bash
Copy
Edit
cd ../frontend
npm start
