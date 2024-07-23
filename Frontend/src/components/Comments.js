import React, { useState, useEffect } from "react";
import { fetchComments, addComment } from "../api";
import Cookies from "js-cookie";

function Comments({ taskId }) {
  const [comments, setComments] = useState([]);
  const [noComment, setNoComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const token = Cookies.get("token");

  useEffect(() => {
    const getComments = async () => {
      try {
        const data = await fetchComments(token, taskId);
        if (data.length === 0) {
          setNoComment("No comments found");
        } else {
          setComments(data); // Assuming the API returns an array of comment objects
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getComments();
  }, [taskId, token]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const newCommentData = await addComment(token, taskId, newComment);
      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment("");
      setNoComment(""); // Clear no comment message when a new comment is added
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading comments...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="mt-8 max-w-3xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-3xl mb-6 font-semibold text-gray-800">Comments</h3>
      <form onSubmit={handleAddComment} className="mb-6 flex flex-col gap-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          placeholder="Add a comment..."
          rows="4"
          required
        ></textarea>
        <button
          type="submit"
          className="self-end bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Submit
        </button>
      </form>
      <div className="max-h-96 overflow-y-auto border-t border-gray-300 p-4">
        {noComment ? (
          <p className="text-center text-gray-500">{noComment}</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li
                key={comment._id}
                className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50"
              >
                <p className="text-gray-700 mb-2">{comment.content}</p>
                <p className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Comments;
