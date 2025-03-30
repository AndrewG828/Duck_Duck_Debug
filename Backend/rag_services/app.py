from rag_chain import final_rag_chain1, final_rag_chain2, filtering_chain, retriever
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import openai
import tempfile
import os
import requests

app = Flask(__name__)
CORS(app)

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route("/query", methods=["POST"])
def query():
    question = request.json.get("question")
    try:
        working = filtering_chain.invoke({"question": question})
        print (working)
        if working == "0":
            answer = final_rag_chain1.invoke({"question": question})
        else:
            answer = final_rag_chain2.invoke({"question": question})
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/process_audio', methods=['POST'])
def process_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']

    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_audio:
        audio_file.save(temp_audio.name)

        try:
            with open(temp_audio.name, "rb") as file:
                transcript = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=file
                )
            return jsonify({'transcription': transcript.text})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            os.remove(temp_audio.name)

@app.route('/tts', methods=['POST'])
def text_to_speech():
    try:
        # Get text from request
        data = request.json
        text = data.get('text')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
            
        # ElevenLabs API endpoint
        url = "https://api.elevenlabs.io/v1/text-to-speech/vDIugAdS5Kvhnm7nVYQ7"
        
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": os.getenv("ELEVENLABS_API_KEY")
        }
        
        payload = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.5
            }
        }
        
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code == 200:
            # Save temporary audio file
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
                temp_audio.write(response.content)
                temp_path = temp_audio.name
                
            # Return the audio file path
            return jsonify({'audio_url': f'/audio/{os.path.basename(temp_path)}'})
        else:
            return jsonify({'error': f'ElevenLabs API error: {response.text}'}), response.status_code
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Add a route to serve the audio files
@app.route('/audio/<filename>', methods=['GET'])
def get_audio(filename):
    try:
        # Construct the path to the temporary file
        temp_dir = tempfile.gettempdir()
        file_path = os.path.join(temp_dir, filename)
        
        # Check if file exists
        if not os.path.exists(file_path):
            return jsonify({'error': 'Audio file not found'}), 404
            
        # Return the audio file
        return send_file(file_path, mimetype='audio/mpeg')
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route("/get_retrieved_code", methods=["POST"])
def get_retrieved_code():
    data = request.get_json()
    question = data.get("question", "")
    docs = retriever.get_relevant_documents(question)
    top2 = docs[:5]
    return jsonify([
        {"content": doc.page_content, "metadata": doc.metadata}
        for doc in top2
    ])

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)
