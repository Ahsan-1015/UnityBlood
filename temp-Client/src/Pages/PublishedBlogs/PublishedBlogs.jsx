import { useEffect, useState } from "react";
import { FaBookOpen, FaTimes } from "react-icons/fa";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const stripHtmlTags = (html) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export default function PublishedBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    axiosPublic.get("/publishedBlogs").then((res) => {
      setBlogs(res.data);
    });
  }, [axiosPublic]);

  const openModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBlog(null);
    setIsModalOpen(false);
  };

  return (
    <main className="bg-slate-50">
      <section className="bg-[#fff7f5] border-b border-red-100">
        <div className="container mx-auto px-6 py-14">
          <p className="text-sm font-bold uppercase tracking-wide text-red-600">
            Resources
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">
            Published blood donation articles
          </h1>
          <p className="mt-3 max-w-2xl leading-8 text-slate-600">
            Read practical guidance, campaign updates, and stories from the
            UnityBlood community.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        {blogs.length < 1 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-extrabold text-slate-950">
              No published blogs found
            </h2>
            <p className="mt-3 text-slate-600">
              Published articles will appear here after admin approval.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-red-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
                  <img
                    src={blog.thumbnailUrl}
                    alt={blog.title}
                    className="h-56 w-full object-cover md:h-full"
                  />
                  <div className="p-6">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-1 text-sm font-bold text-red-700">
                      <FaBookOpen />
                      Article
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-950">
                      {blog.title}
                    </h2>
                    <p className="mt-3 leading-7 text-slate-600">
                      {stripHtmlTags(blog.content).length > 130
                        ? `${stripHtmlTags(blog.content).substring(0, 130)}...`
                        : stripHtmlTags(blog.content)}
                    </p>
                    <button
                      onClick={() => openModal(blog)}
                      className="mt-6 rounded-md bg-teal-700 px-5 py-2.5 font-bold text-white transition hover:bg-teal-800"
                    >
                      Read Article
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {isModalOpen && selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-2xl">
            <img
              src={selectedBlog.thumbnailUrl}
              alt={selectedBlog.title}
              className="h-64 w-full object-cover"
            />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-3xl font-extrabold text-slate-950">
                  {selectedBlog.title}
                </h2>
                <button
                  onClick={closeModal}
                  className="rounded-md border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
                  aria-label="Close blog"
                >
                  <FaTimes />
                </button>
              </div>
              <div
                className="prose mt-5 max-w-none text-slate-700"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
