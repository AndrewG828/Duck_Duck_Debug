import torch
import pandas as pd
from bert_training import BertEmbedder

device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
print(f"Using device: {device}")

# --- Load Test Data ---
df = pd.read_csv("../models/test.csv")
nl_texts = df["nl_text"].tolist()
code_texts = df["code_snippet"].tolist()

# --- Load Trained Model ---
model = BertEmbedder(dropout_prob=0.2)
model.load_state_dict(torch.load("bert4.pth", map_location=device))
model.to(device)
model.eval()

# --- Encode Code Snippets (batch inference) ---
with torch.no_grad():
    code_embeddings = []
    batch_size = 16
    for i in range(0, len(code_texts), batch_size):
        batch = code_texts[i : i + batch_size]
        code_emb = model(batch)
        code_embeddings.append(code_emb)
    code_embeddings = torch.cat(code_embeddings, dim=0)

# --- Encode NL Queries (batch inference) ---
with torch.no_grad():
    nl_embeddings = []
    batch_size = 16
    for i in range(0, len(nl_texts), batch_size):
        batch = nl_texts[i : i + batch_size]
        nl_emb = model(batch)
        nl_embeddings.append(nl_emb)
    nl_embeddings = torch.cat(nl_embeddings, dim=0)

# --- Compute Similarity (dot-product or optionally apply temperature) ---
similarity_matrix = torch.matmul(nl_embeddings, code_embeddings.T)
# similarity_matrix /= temperature  # if you used a specific temperature in training

# --- Retrieve Top-k Results ---
top_k = 5
topk_scores, topk_indices = torch.topk(similarity_matrix, k=top_k, dim=1)

# --- Compute "Test Loss" = fraction of NL queries where the correct code isn't in top 5 ---
miss_count = 0
num_queries = len(nl_texts)
for i in range(num_queries):
    # If the correct snippet for row i isn't in topk_indices[i], we consider it a miss
    if i not in topk_indices[i]:
        miss_count += 1

test_loss = miss_count / num_queries
print(f"Test Loss (fraction of NL queries missed in top-{top_k}): {test_loss:.4f} "
      f"(missed {miss_count} out of {num_queries})")

# --- Save Retrieval Results for inspection ---
rows = []
for i, nl in enumerate(nl_texts):
    for rank in range(top_k):
        code_idx = topk_indices[i][rank].item()
        score = topk_scores[i][rank].item()
        rows.append({
            "nl_query": nl,
            "nl_index": i,
            "rank": rank + 1,
            "matched_code_snippet": code_texts[code_idx],
            "matched_code_index": code_idx,
            "similarity_score": score,
            "is_correct_code": (i == code_idx)
        })

results_df = pd.DataFrame(rows)
results_df.to_csv("retrieval_results.csv", index=False)
print("✅ Results saved to retrieval_results.csv")
