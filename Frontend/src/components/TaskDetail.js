import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOneTasks, fetchAttachments, uploadAttachment } from "../api";
import Cookies from "js-cookie";
import Comments from "./Comments"; // Import the Comments component
import { FaArrowLeft } from "react-icons/fa"; // Icon for the back button

function TaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // State for image preview
  const token = Cookies.get("token");

  useEffect(() => {
    const getTaskDetail = async () => {
      try {
        const taskData = await fetchOneTasks(token, taskId);
        setTask(taskData);

        // Fetch attachments
        const attachmentData = await fetchAttachments(token, taskId);
        setAttachments(attachmentData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getTaskDetail();
  }, [taskId, token]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Preview image
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("taskId", taskId);

    try {
      await uploadAttachment(token, formData);
      // Refresh attachments after upload
      const updatedAttachments = await fetchAttachments(token, taskId);
      setAttachments(updatedAttachments);
      setFile(null); // Clear the file input
      setPreview(null); // Clear the preview
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div> {/* Replace with your spinner */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-6">
        <p className="text-xl">Error: {error}</p>
        <button
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center text-gray-600 mt-6">
        <p className="text-xl">No task found</p>
        <button
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg flex flex-col lg:flex-row gap-8">
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <button
          className="flex items-center text-blue-600 hover:text-blue-800 text-lg mb-6 focus:outline-none"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
          {task.title}
        </h2>
        <div className="space-y-6">
          <DetailItem label="Description" value={task.description} />
          <DetailItem
            label="Status"
            value={task.status}
            className={getStatusClass(task.status)}
          />
          <DetailItem
            label="Priority"
            value={task.priority}
            className={getPriorityClass(task.priority)}
          />
          <DetailItem
            label="Due Date"
            value={new Date(task.dueDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          />
          <DetailItem
            label="Assigned To"
            value={task.assignedTo ? task.assignedTo.name : "Unassigned"}
          />
          <DetailItem
            label="Created At"
            value={new Date(task.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          />
          <DetailItem
            label="Updated At"
            value={new Date(task.updatedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          />
        </div>

        {/* Attachment Upload */}
        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Upload Attachment
          </h3>
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-4 border border-gray-300 rounded-lg p-2 w-full"
          />
          {preview && (
            <div className="mb-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Upload
          </button>
        </div>

        {/* Attachments List */}
        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Attachments
          </h3>
          {attachments.length === 0 ? (
            <p>No attachments found.</p>
          ) : (
            <ul className="list-disc pl-5 space-y-2">
              {attachments.map((attachment) => (
                <li key={attachment._id} className="flex items-center">
                  {attachment.filePath.endsWith(".jpg") ||
                  attachment.filePath.endsWith(".jpeg") ||
                  attachment.filePath.endsWith(".png") ? (
                    <img
                      src={attachment.filePath}
                      alt={attachment.filename}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-300 mr-2"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center border border-gray-300 rounded-lg mr-2">
                      <span className="text-gray-600">File</span>
                    </div>
                  )}
                  <a
                    href={attachment.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {attachment.filename}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-3xl font-semibold text-gray-900 mb-6">Comments</h3>
        <Comments taskId={taskId} />
      </div>
    </div>
  );
}

const DetailItem = ({ label, value, className }) => (
  <div className="flex items-center mb-4">
    <p className="text-gray-800 text-xl font-medium mr-4">{label}:</p>
    <p className={`text-gray-600 text-lg ${className}`}>{value}</p>
  </div>
);

const getStatusClass = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-600";
    case "In Progress":
      return "bg-yellow-100 text-yellow-600";
    default:
      return "bg-red-100 text-red-600";
  }
};

const getPriorityClass = (priority) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-600";
    case "Medium":
      return "bg-yellow-100 text-yellow-600";
    default:
      return "bg-green-100 text-green-600";
  }
};

export default TaskDetail;
