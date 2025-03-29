from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import tempfile
import os

app = Flask(name)
CORS(app)

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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

if name == 'main':
    app.run(debug=True, host='0.0.0.0', port=5000)