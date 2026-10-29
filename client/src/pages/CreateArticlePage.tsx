
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CreateArticlePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate the input fields
    if (!title.trim() || !contents.trim()) {
      setError("Both title and contents are required.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      const response = await fetch("http://localhost:8080/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          contents: contents.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create article.");
      }

      const newArticle = await response.json();

      // Navigate to the newly created article
      navigate(`/articles/${newArticle.id}`);
    } catch {
      setError("Unable to create article. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main>
      <h1>Create Article</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <br />
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="contents">Contents</label>
          <br />
          <textarea
            id="contents"
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            rows={8}
          />
        </div>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={saving}>
          {saving ? "Creating..." : "Create Article"}
        </button>
      </form>

      <p>
        <Link to="/">Back to Articles</Link>
      </p>
    </main>
  );
}

export default CreateArticlePage;
