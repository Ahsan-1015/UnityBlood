import { Link } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import DotLoading from "../Shared/DotLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheckCircle, faTimesCircle, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

export default function ContentManagement() {
  const axiosSecure = useAxiosSecure();
  const { userInfo } = useContext(AuthContext);

  const { data: blogs = [], refetch, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const response = await axiosSecure.get("/allBlogs");
      return response.data;
    },
  });

  const handlePublish = (id) => {
    axiosSecure
      .patch(`/blog-status-update/${id}`, { status: "published" })
      .then(() => {
        refetch();
        Swal.fire({
          icon: "success",
          title: "Blog Published!",
          text: "The blog is now visible on the public page.",
          background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
          color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  const handleUnpublish = (id) => {
    axiosSecure
      .patch(`/blog-status-update/${id}`, { status: "draft" })
      .then(() => {
        refetch();
        Swal.fire({
          icon: "info",
          title: "Blog Unpublished",
          text: "The blog has been set to draft mode.",
          background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
          color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header section */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>Content Management</h1>
          <p>Create, write, publish, or draft blogs and educational resources</p>
        </div>
        <div>
          <Link to="/dashboard/content-management/add-blog">
            <button className="btn-red flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} />
              Add Blog Post
            </button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <DotLoading />
        </div>
      ) : blogs.length === 0 ? (
        <div className="db-card p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 text-2xl">
            <FontAwesomeIcon icon={faBookOpen} />
          </div>
          <h3 className="text-lg font-bold db-text">No Blogs Available</h3>
          <p className="text-sm db-text-muted mt-1 max-w-md">
            Start writing educational blood donation blogs and impact stories by clicking "Add Blog Post" above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, index) => (
            <div key={index} className="db-card overflow-hidden flex flex-col">
              {/* Thumbnail */}
              <div className="h-48 w-full overflow-hidden relative bg-slate-800">
                <img
                  src={blog.thumbnailUrl || "https://images.unsplash.com/photo-1615461066841-6116ecdccd04"}
                  alt={blog.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className={`absolute top-3 right-3 badge capitalize ${
                  blog.status === "draft" ? "badge-draft" : "badge-published"
                }`}>
                  {blog.status}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold db-text line-clamp-2 leading-snug">
                  {blog.title}
                </h3>
                
                <div 
                  className="mt-3 text-sm db-text-muted line-clamp-3 flex-1"
                  dangerouslySetInnerHTML={{
                    __html: blog.content,
                  }}
                />

                {userInfo?.role === "Admin" && (
                  <div className="flex gap-2 mt-5 pt-4 border-t db-border">
                    {blog.status === "draft" ? (
                      <button
                        onClick={() => handlePublish(blog._id)}
                        className="flex-1 py-2 px-3 text-xs rounded-lg font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-500 dark:text-emerald-400 transition-all duration-200 border border-emerald-500/20 flex items-center justify-center gap-1.5"
                      >
                        <FontAwesomeIcon icon={faCheckCircle} />
                        Publish Post
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnpublish(blog._id)}
                        className="flex-1 py-2 px-3 text-xs rounded-lg font-bold bg-red-500/15 hover:bg-red-500/25 text-red-500 dark:text-red-400 transition-all duration-200 border border-red-500/20 flex items-center justify-center gap-1.5"
                      >
                        <FontAwesomeIcon icon={faTimesCircle} />
                        Unpublish Post
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
