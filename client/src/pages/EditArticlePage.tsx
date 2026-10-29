
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { FormEvent } from "react";

interface Article {
  articleId: number;
  title: string;
  contents: string;
}

function EditArticlePage() {
  const { articleId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load the existing article
  useEffect(() => {
    const controller = new AbortController();

    async function fetchArticle() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://localhost:8080/articles/${articleId}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to load article.");
        }

        const article: Article = await response.json();

        setTitle(article.title);
        setContents(article.contents);
      } catch {
        if (!controller.signal.aborted) {
          setError("Unable to load the article.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchArticle();

    return () => controller.abort();
  }, [articleId]);

  // Submit the updated article
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim() || !contents.trim()) {
      setError("Both title and contents are required.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      const response = await fetch(
        `http://localhost:8080/articles/${articleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            contents: contents.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update article.");
      }

      navigate(`/articles/${articleId}`);
    } catch {
      setError("Unable to update the article.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main><p>Loading article...</p></main>;
  }

  return (
    <main>
      <h1>Edit Article</h1>

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
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <p>
        <Link to={`/articles/${articleId}`}>Cancel</Link>
      </p>
    </main>
  );
}

export default EditArticlePage;
