import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  AlertCircle,
  X,
  Award,
  Pen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import testSticker from "../../assets/test-sticker.svg";
export interface Test {
  id: string;
  name: string;
  subject: string;
  topics?: string[];
  status: "Active" | "Draft" | "Completed" | "Live";
  createdDate: string;
  questionsCount: number;
  duration: number;
  type?: string;
  difficulty?: string;
}

interface TestListProps {
  tests: Test[];
  onDelete: (id: string) => void;
  onEditStart: (id: string) => void;
  onCreateNew: () => void;
}

const TestList = ({
  tests,
  onDelete,
  onEditStart,
  onCreateNew,
}: TestListProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  const getDifficultyColor = (difficulty?: string) => {
    const diff = difficulty?.toLowerCase();
    if (diff === "medium") return "bg-amber-500 text-white";
    if (diff === "difficult" || diff === "hard")
      return "bg-rose-500 text-white";
    return "bg-[#2dd4bf] text-white"; // default/easy
  };

  const formatType = (type?: string) => {
    if (!type) return "Chapter Wise";
    if (type === "chapterwise") return "Chapter Wise";
    if (type === "subjectwise") return "Subject Wise";
    if (type === "full") return "Full Test";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState<Test | null>(null);

  // Search and filter
  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test?.subject?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredTests.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredTests.length);
  const paginatedTests = filteredTests.slice(startIndex, endIndex);

  // Fallback in case current page goes out of bounds (e.g. after deletion or search changes)
  if (currentPage > 1 && currentPage > totalPages) {
    setCurrentPage(Math.max(1, totalPages));
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  // Delete handler
  const handleDeleteTest = (test: Test) => {
    setTestToDelete(test);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (testToDelete) {
      onDelete(testToDelete.id);
      setIsDeleteModalOpen(false);
      setTestToDelete(null);
    }
  };

  // Open View Modal
  const openViewModal = (test: Test) => {
    navigate(`/tests/view/${test.id}`);
  };

  const getStatusStyle = (status: Test["status"]) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Draft":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Completed":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Live":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#d9e5f7] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Tests Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track your exam papers
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue-hover transition-all cursor-pointer w-full sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          Create New Test
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
        <div className="flex flex-1 items-center bg-white px-4 py-2.5 rounded-xl border border-[#d9e5f7] shadow-2xs w-full sm:max-w-md">
          <Search className="h-4.5 w-4.5 text-gray-400 mr-2.5" />
          <input
            type="text"
            placeholder="Search by test name or subject..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Cards Layout */}
      {filteredTests.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-300 py-16 px-4 text-center">
          <AlertCircle className="h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-700">
            No tests found
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Try resetting your search query or create a new test
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTests.map((test) => (
              <div
                key={test.id}
                className="relative flex flex-col bg-white rounded-2xl border border-[#d9e5f7] p-5 hover:shadow-md hover:border-[#1f59da]/30 transition-all duration-200"
              >
                {/* Category Pill, Status Badge and Actions */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#0b1b3e] text-white text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
                      {formatType(test.type)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusStyle(test.status)}`}
                    >
                      {test.status === "Active" && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                      )}
                      {test.status === "Active" ? "Live" : test.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openViewModal(test)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEditStart(test.id)}
                      className="p-1.5 text-[#1f59da] hover:text-[#1546be] hover:bg-[#f0f4fe] rounded-lg transition-colors cursor-pointer"
                      title="Edit Test"
                    >
                      <Pen className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTest(test)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Test"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Title and Level */}
                <div className="flex items-center gap-2 mb-4">
                  <img src={testSticker} className="h-4 w-4" />
                  <h3 className="text-sm font-bold text-text-heading line-clamp-1">
                    {test.name}
                  </h3>
                  <span
                    className={`${getDifficultyColor(test.difficulty)} text-[10px] font-semibold px-2.5 py-0.5 rounded-lg flex items-center gap-1 capitalize`}
                  >
                    <Award className="h-2.5 w-2.5" />
                    {test.difficulty || "Easy"}
                  </span>
                </div>

                {/* Details layout with gray labels and colon alignment */}
                <div className="space-y-2 text-xs mb-6 font-semibold">
                  <div className="flex items-center">
                    <span className="w-16 text-gray-400 text-xs font-normal">
                      Subject
                    </span>
                    <span className="text-gray-300 mr-2">:</span>
                    <span className="text-[#4b5563]">{test.subject}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-16 text-gray-400 font-normal">
                      Topic
                    </span>
                    <span className="text-gray-300 mr-2">:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {test.topics && test.topics.length > 0 ? (
                        test.topics.map((t) => (
                          <span
                            key={t}
                            className="bg-white text-[#fbbf24] border border-[#facc15] px-2 py-0.5 rounded-lg text-[10px] font-bold capitlize"
                          >
                            {t}
                          </span>
                        ))
                      ) : test.subject === "Chemistry" ? (
                        <span className="bg-white text-[#fbbf24] border border-[#facc15] px-2 py-0.5 rounded-lg text-[10px] font-bold">
                          Organic
                        </span>
                      ) : test.subject === "Physics" ? (
                        <span className="bg-white text-[#fbbf24] border border-[#facc15] px-2 py-0.5 rounded-lg text-[10px] font-bold">
                          Mechanics
                        </span>
                      ) : (
                        <>
                          <span className="bg-white text-[#fbbf24] border border-[#facc15] px-2 py-0.5 rounded-lg text-[10px] font-bold">
                            Grammar
                          </span>
                          <span className="bg-white text-[#fbbf24] border border-[#facc15] px-2 py-0.5 rounded-lg text-[10px] font-bold">
                            Writing
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="w-16 text-gray-400 font-normal">
                      Sub Topic
                    </span>
                    <span className="text-gray-300 mr-2">:</span>
                    <span className="bg-white text-[#fbbf24] border border-[#facc15] px-2 py-0.5 rounded-lg text-[10px] font-bold">
                      Application
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-16 text-gray-400 font-normal">
                      Created On
                    </span>
                    <span className="text-gray-300 mr-2">:</span>
                    <span className="text-[#4b5563]">{test.createdDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {filteredTests.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-6 py-4 rounded-2xl border border-[#d9e5f7] shadow-xs mt-8">
              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Show</span>
                <div className="relative">
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="appearance-none text-xs font-semibold text-gray-700 bg-white border border-[#d9e5f7] rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 cursor-pointer shadow-2xs transition-all"
                  >
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400">
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  per page
                </span>
              </div>

              {/* Info */}
              <div className="text-xs text-gray-500 font-medium">
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-800">{endIndex}</span>{" "}
                of{" "}
                <span className="font-semibold text-gray-800">
                  {filteredTests.length}
                </span>{" "}
                tests
              </div>

              {/* Page Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#d9e5f7] bg-white text-gray-600 hover:bg-[#f0f4fe] hover:text-[#1f59da] hover:border-[#1f59da]/30 transition-all disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-[#d9e5f7] disabled:cursor-not-allowed cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {getPageNumbers().map((page, idx) => {
                  if (page === "...") {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="w-8 h-8 flex items-center justify-center text-xs font-semibold text-gray-400"
                      >
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(Number(page))}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                        currentPage === page
                          ? "bg-brand-blue text-white shadow-md cursor-default scale-105"
                          : "bg-white text-gray-600 border border-[#d9e5f7] hover:bg-[#f0f4fe] hover:text-[#1f59da] hover:border-[#1f59da]/30 cursor-pointer"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#d9e5f7] bg-white text-gray-600 hover:bg-[#f0f4fe] hover:text-[#1f59da] hover:border-[#1f59da]/30 transition-all disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-[#d9e5f7] disabled:cursor-not-allowed cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {isDeleteModalOpen && testToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                Delete Test
              </h3>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setTestToDelete(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete the test{" "}
                <span className="font-semibold text-gray-900">
                  "{testToDelete.name}"
                </span>
                ?
              </p>
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">
                  This action is permanent and cannot be undone. This will
                  delete all questions and history associated with this test.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setTestToDelete(null);
                }}
                className="px-4 py-2 bg-white border border-[#d9e5f7] hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg cursor-pointer transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestList;
