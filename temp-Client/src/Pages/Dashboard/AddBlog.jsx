import axios from "axios";
import JoditEditor from "jodit-react";
import { useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSpinner, faUpload, faBook } from "@fortawesome/free-solid-svg-icons";

export default function AddBlog({ placeholder = "Start typing..." }) {
  const editor = useRef(null);
  const fileInputRef = useRef(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const apiKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder,
      theme: document.documentElement.classList.contains("dark") ? "dark" : "default",
    }),
    [placeholder]
  );

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", thumbnail);

    try {
      setIsUploading(true);
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const formDataDB = {
        title,
        thumbnailUrl: response?.data?.data?.display_url,
        content,
        status: "draft",
      };

      await axiosSecure.post("/createBlog", formDataDB).then((res) => {
        if (res.status === 200) {
          setTitle("");
          setThumbnail(null);
          setContent("");
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          Swal.fire({
            icon: "success",
            title: "Blog Created Successfully!",
            text: "Your blog post has been saved as a draft.",
            background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
            color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Could not upload the thumbnail image.",
        background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
        color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header section */}
      <div className="page-header">
        <h1>Add Blog Post</h1>
        <p>Write stories, news, guides, and important donor resources to display publicly</p>
      </div>

      <div className="db-card p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="db-label">
              Blog Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the blog title"
              required
              className="db-input"
            />
          </div>

          <div>
            <label htmlFor="thumbnail" className="db-label">
              Thumbnail Image
            </label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={handleThumbnailChange}
              ref={fileInputRef}
              required
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-500/10 file:text-red-500 hover:file:bg-red-500/20 db-input"
            />
          </div>

          <div>
            <label className="db-label">
              Content
            </label>
            {/* Wrapper to styling JoditEditor for dark/light mode compatibility */}
            <div className="border db-border rounded-lg overflow-hidden bg-white text-black dark:bg-slate-950 dark:text-slate-200">
              <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={1}
                onBlur={(newContent) => setContent(newContent)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full btn-red flex items-center justify-center gap-2 py-3 ${
                isUploading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isUploading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  Uploading thumbnail image...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPlus} />
                  Create Blog Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
