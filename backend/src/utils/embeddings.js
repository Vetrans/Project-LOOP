// A dependency-free stand-in for a hosted embeddings provider (brief
// §05 lists "pgvector / hosted embeddings provider" as swappable). This
// uses a hashing-trick bag-of-words vector so semantic retrieval works
// out of the box with zero external services or API keys.
//
// To upgrade to real embeddings in production: replace embedText() with
// a call to an embeddings API (OpenAI, Voyage, etc.) or move retrieval
// into MongoDB Atlas Vector Search — everything downstream (cosine
// ranking, the retrieve-then-answer flow in insight.routes.js) stays
// the same.

const DIMENSIONS = 256;

const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "is",
  "are",
  "was",
  "were",
  "to",
  "of",
  "and",
  "in",
  "on",
  "for",
  "it",
  "this",
  "that",
  "i",
  "we",
  "you",
  "they",
  "with",
  "my",
  "our",
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

function hashToken(token) {
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    hash = (hash * 31 + token.charCodeAt(i)) >>> 0;
  }
  return hash % DIMENSIONS;
}

export function embedText(text) {
  const vector = new Array(DIMENSIONS).fill(0);
  for (const token of tokenize(text)) {
    vector[hashToken(token)] += 1;
  }
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vector.map((v) => v / norm);
}

export function cosineSimilarity(a, b) {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot; // both vectors are already unit-normalized
}

// Retrieve the top-K most similar feedback docs to a question, scoped to
// a workspace. `docs` must each have an `embedding` array (select it
// explicitly since the schema marks it select:false by default).
export function topKSimilar(questionVector, docs, k = 5) {
  return docs
    .map((doc) => ({
      doc,
      score: cosineSimilarity(questionVector, doc.embedding || []),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .filter((r) => r.score > 0)
    .map((r) => r.doc);
}
