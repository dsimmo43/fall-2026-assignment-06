
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

interface Comment {
  commentId: number;
  body: string;
}

interface CommentsListProps {
  articleId: string;
}

function CommentsList({ articleId }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBody, setEditBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const apiUrl = `http://localhost:8080/articles/${articleId}/comments`;

  // Load comments when the article changes
  useEffect(() => {
    const controller = new AbortController();

    async function fetchComments() {
      setLoading(true);
      setError("");
      setComments([]);
      setNewComment("");
      setEditingId(null);

      try {
        const response = await fetch(apiUrl, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch comments.");
        }

        const data: Comment[] = await response.json();
        setComments(data);
      } catch {
        if (!controller.signal.aborted) {
          setError("Unable to load comments.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchComments();

    return () => controller.abort();
  }, [apiUrl]);

  // Add a new comment
  async function handleAddComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: newComment.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment.");
      }

      const createdComment: Comment = await response.json();

      setComments((previous) => [...previous, createdComment]);
      setNewComment("");
    } catch {
      setError("Unable to add comment.");
    } finally {
      setSaving(false);
    }
  }

  // Start editing a comment
  function startEditing(comment: Comment) {
    setEditingId(comment.commentId);
    setEditBody(comment.body);
    setError("");
  }

  // Save an edited comment
  async function handleEditComment(
    e: FormEvent<HTMLFormElement>,
    commentId: number
  ) {
    e.preventDefault();

    if (!editBody.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      const response = await fetch(`${apiUrl}/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: editBody.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to update comment.");
      }

      const updatedComment: Comment = await response.json();

      setComments((previous) =>
        previous.map((comment) =>
          comment.commentId === commentId ? updatedComment : comment
        )
      );

      setEditingId(null);
      setEditBody("");
    } catch {
      setError("Unable to update comment.");
    } finally {
      setSaving(false);
    }
  }

  // Delete a comment
  async function handleDeleteComment(commentId: number) {
    if (!window.confirm("Delete this comment?")) {
      return;
    }

    setError("");

    try {
      const response = await fetch(`${apiUrl}/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment.");
      }

      setComments((previous) =>
        previous.filter((comment) => comment.commentId !== commentId)
      );
    } catch {
      setError("Unable to delete comment.");
    }
  }

  return (
    <section className="comments-section">
      <h2>Comments</h2>

      {error && <p role="alert">{error}</p>}

      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.commentId} className="comment-card">
            {editingId === comment.commentId ? (
              <form
                onSubmit={(e) =>
                  handleEditComment(e, comment.commentId)
                }
              >
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={3}
                />

                <button type="submit" disabled={saving}>
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setEditBody("");
                    setError("");
                  }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <p>{comment.body}</p>

                <div className="comment-actions">
                    <button
                    type="button"
                    onClick={() => startEditing(comment)}
                    >
                    Edit
                    </button>

                    <button
                    type="button"
                    onClick={() => handleDeleteComment(comment.commentId)}
                    >
                    Delete
                    </button>
                </div>
                </>
            )}

          </div>
        ))
      )}

      <h3>Add a Comment</h3>

      <form onSubmit={handleAddComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={4}
          placeholder="Write your comment..."
        />

        <br />

        <button type="submit" disabled={saving}>
          {saving ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </section>
  );
}

export default CommentsList;
