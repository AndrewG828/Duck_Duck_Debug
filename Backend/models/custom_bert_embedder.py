from langchain.embeddings.base import Embeddings
from typing import List
import torch
from models.bert_training import BertEmbedder  # assumes bert_training.py is in same folder

device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")

class CustomBertEmbeddings(Embeddings):
    def __init__(self, model_path="../models/bert4.pth"):
        self.model = BertEmbedder()
        self.model.load_state_dict(torch.load(model_path, map_location=device))
        self.model.to(device)
        self.model.eval()

    @torch.no_grad()
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return self.model.embed_texts(texts)

    @torch.no_grad()
    def embed_query(self, text: str) -> List[float]:
        return self.model.embed_texts([text])[0]
