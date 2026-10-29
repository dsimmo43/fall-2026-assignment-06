
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Define the structure of an article
interface Article {
  articleId: number;
  title: string;
  contents: string;
}

function ArticleListPage() {
  // Store the articles returned by the API
  const [articles, setArticles] = useState<Article[]>([]);

  // Store the search input
  const [search, setSearch] = useState("");

  // Track loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch articles whenever the search changes
  useEffect(() => {
    const controller = new AbortController();

    async function fetchArticles() {
      setLoading(true);
      setError("");

      try {
        const url = new URL("http://localhost:8080/articles");

        if (search.trim()) {
          url.searchParams.set("title_contains", search.trim());
        }

        const response = await fetch(url.toString(), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch articles.");
        }

        const data: Article[] = await response.json();
        setArticles(data);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError("Unable to load articles. Check that the API is running.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchArticles();

    return () => controller.abort();
  }, [search]);

  return (
    <main>
      <h1>Articles</h1>
      <p>Browse all available articles.</p>

      {/* Search articles by title */}
      <input
        type="text"
        placeholder="Search articles by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Navigate to the create form */}
      <p>
        <Link to="/articles/new">Create Article</Link>
      </p>

      {/* Loading and error messages */}
      {loading && <p>Loading articles...</p>}
      {error && <p>{error}</p>}

      {/* Display articles */}
      {!loading && !error && (
        <section>
          {articles.length === 0 ? (
            <p>No articles found.</p>
          ) : (
            articles.map((article) => (
              <article key={article.articleId}>
                <h2>{article.title}</h2>

                <p>
                  {article.contents.length > 150
                    ? article.contents.slice(0, 150) + "..."
                    : article.contents}
                </p>

                <Link to={`/articles/${article.articleId}`}>
                  Read Article
                </Link>

                <hr />
              </article>
            ))
          )}
        </section>
      )}
    </main>
  );
}

export default ArticleListPage;
