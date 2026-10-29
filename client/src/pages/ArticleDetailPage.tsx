
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CommentsList from "../components/CommentsList";

interface Article {
  articleId: number;
  title: string;
  contents: string;
}

function ArticleDetailPage() {
  const { articleId } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Fetch the selected article
  useEffect(() => {
    const controller = new AbortController();

    async function fetchArticle() {
      setLoading(true);
      setError("");
      setArticle(null);

      try {
        const response = await fetch(
          `http://localhost:8080/articles/${articleId}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch article.");
        }

        const data: Article = await response.json();
        setArticle(data);
      } catch {
        if (!controller.signal.aborted) {
          setError("Unable to load this article.");
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

  // Delete the selected article
  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this article?")) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8080/articles/${articleId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete article.");
      }

      navigate("/");
    } catch {
      setError("Unable to delete the article.");
      setDeleting(false);
    }
  }

  if (loading) {
    return <main><p>Loading article...</p></main>;
  }

  if (!article) {
    return (
      <main>
        <p>{error || "Article not found."}</p>
        <Link to="/">Back to Articles</Link>
      </main>
    );
  }

  return (
    <main>
      <Link to="/">Back to Articles</Link>

      <h1>{article.title}</h1>
      <p style={{ whiteSpace: "pre-wrap" }}>{article.contents}</p>

      <div>
        <Link to={`/articles/${article.articleId}/edit`}>
          Edit Article
        </Link>

        {" | "}

        <button onClick={handleDelete} disabled={deleting}>
          {deleting ? "Deleting..." : "Delete Article"}
        </button>
      </div>

      {error && <p role="alert">{error}</p>}

      <hr />
      
      <CommentsList articleId={articleId!} />
    </main>
  );
}

export default ArticleDetailPage;
