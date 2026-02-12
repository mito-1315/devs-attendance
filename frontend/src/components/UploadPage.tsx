import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  History,
  Calendar,
  User,
  UserPlus,
  LogOut
} from "lucide-react";
import { logout } from "../services/auth";

interface UploadPageProps {
  isDark: boolean;
  onNavigateToAttendance: (eventName: string) => void;
  onNavigateToHistory: () => void;
  onNavigateToSessions: () => void;
  onNavigateToProfile: () => void;
  onNavigateToCreateUser: () => void;
  onLogout?: () => void; // Add optional onLogout prop
}

export function UploadPage({
  isDark,
  onNavigateToAttendance,
  onNavigateToHistory,
  onNavigateToSessions,
  onNavigateToProfile,
  onNavigateToCreateUser,
  onLogout,
}: UploadPageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showEventNameModal, setShowEventNameModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Update dropdown position when menu opens
  useEffect(() => {
    if (menuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  }, [menuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleMenuItemClick = (item: string) => {
    setMenuOpen(false);
    if (item === "History") {
      onNavigateToHistory();
    } else if (item === "Sessions") {
      onNavigateToSessions();
    } else if (item === "Profile") {
      onNavigateToProfile();
    } else if (item === "Create User") {
      onNavigateToCreateUser();
    } else if (item === "Logout") {
      logout();
      if (onLogout) onLogout();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      console.log("Submitting file:", selectedFile.name);
      setShowEventNameModal(true);
    }
  };

  const handleEventNameSubmit = () => {
    if (eventName) {
      console.log("Event Name:", eventName);
      onNavigateToAttendance(eventName);
    }
  };

  return (
    <div className="min-h-screen w-full p-4 relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 blur-3xl opacity-20"
        style={{
          background: isDark
            ? "radial-gradient(circle, #4a1a4a 0%, transparent 70%)"
            : "radial-gradient(circle, #b91372 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 blur-3xl opacity-15"
        style={{
          background: isDark
            ? "radial-gradient(circle, #b91372 0%, transparent 70%)"
            : "radial-gradient(circle, #4a1a4a 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div
        className="flex justify-between items-center mb-8 md:mb-12 relative z-10 pt-12"
        ref={menuRef}
      >
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-3 transition-all hover:scale-105"
            style={{
              backgroundColor: isDark
                ? "rgba(74, 26, 74, 0.2)"
                : "rgba(185, 19, 114, 0.1)",
              color: isDark ? "#f5f0ff" : "#0a1128",
            }}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div
              className="fixed w-48 shadow-2xl backdrop-blur-sm overflow-hidden z-[9999]"
              style={{
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
                backgroundColor: isDark
                  ? "rgba(10, 17, 40, 0.95)"
                  : "rgba(255, 255, 255, 0.95)",
                border: `1px solid ${
                  isDark ? "rgba(74, 26, 74, 0.5)" : "rgba(185, 19, 114, 0.3)"
                }`,
              }}
            >
              <button
                onClick={() => handleMenuItemClick("Upload")}
                className="w-full px-4 py-3 flex items-center gap-3 transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: isDark
                    ? "rgba(74, 26, 74, 0.2)"
                    : "rgba(185, 19, 114, 0.1)",
                  color: isDark ? "#f5f0ff" : "#0a1128",
                  borderBottom: `1px solid ${
                    isDark ? "rgba(74, 26, 74, 0.3)" : "rgba(185, 19, 114, 0.2)"
                  }`,
                }}
              >
                <Upload
                  className="w-5 h-5"
                  style={{ color: isDark ? "#b91372" : "#4a1a4a" }}
                />
                <span className="text-sm">Upload</span>
              </button>
              <button
                onClick={() => handleMenuItemClick("History")}
                className="w-full px-4 py-3 flex items-center gap-3 transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: isDark
                    ? "rgba(74, 26, 74, 0.2)"
                    : "rgba(185, 19, 114, 0.1)",
                  color: isDark ? "#f5f0ff" : "#0a1128",
                  borderBottom: `1px solid ${
                    isDark ? "rgba(74, 26, 74, 0.3)" : "rgba(185, 19, 114, 0.2)"
                  }`,
                }}
              >
                <History
                  className="w-5 h-5"
                  style={{ color: isDark ? "#b91372" : "#4a1a4a" }}
                />
                <span className="text-sm">History</span>
              </button>
              <button
                onClick={() => handleMenuItemClick("Sessions")}
                className="w-full px-4 py-3 flex items-center gap-3 transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: isDark
                    ? "rgba(74, 26, 74, 0.2)"
                    : "rgba(185, 19, 114, 0.1)",
                  color: isDark ? "#f5f0ff" : "#0a1128",
                  borderBottom: `1px solid ${
                    isDark ? "rgba(74, 26, 74, 0.3)" : "rgba(185, 19, 114, 0.2)"
                  }`,
                }}
              >
                <Calendar
                  className="w-5 h-5"
                  style={{ color: isDark ? "#b91372" : "#4a1a4a" }}
                />
                <span className="text-sm">Sessions</span>
              </button>
              <button
                onClick={() => handleMenuItemClick("Profile")}
                className="w-full px-4 py-3 flex items-center gap-3 transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: isDark
                    ? "rgba(74, 26, 74, 0.2)"
                    : "rgba(185, 19, 114, 0.1)",
                  color: isDark ? "#f5f0ff" : "#0a1128",
                  borderBottom: `1px solid ${
                    isDark ? "rgba(74, 26, 74, 0.3)" : "rgba(185, 19, 114, 0.2)"
                  }`,
                }}
              >
                <User
                  className="w-5 h-5"
                  style={{ color: isDark ? "#b91372" : "#4a1a4a" }}
                />
                <span className="text-sm">Profile</span>
              </button>
              <button
                onClick={() => handleMenuItemClick("Create User")}
                className="w-full px-4 py-3 flex items-center gap-3 transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: isDark
                    ? "rgba(74, 26, 74, 0.2)"
                    : "rgba(185, 19, 114, 0.1)",
                  color: isDark ? "#f5f0ff" : "#0a1128",
                }}
              >
                <UserPlus
                  className="w-5 h-5"
                  style={{ color: isDark ? "#b91372" : "#4a1a4a" }}
                />
                <span className="text-sm">Create User</span>
              </button>
              <button
                onClick={() => handleMenuItemClick("Logout")}
                className="w-full px-4 py-3 flex items-center gap-3 transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: isDark
                    ? "rgba(74, 26, 74, 0.2)"
                    : "rgba(185, 19, 114, 0.1)",
                  color: isDark ? "#f5f0ff" : "#0a1128",
                }}
              >
                <LogOut
                  className="w-5 h-5"
                  style={{ color: isDark ? "#b91372" : "#4a1a4a" }}
                />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto relative z-1">
        <div
          className="shadow-2xl p-8 md:p-12 backdrop-blur-sm relative z-0"
          style={{
            backgroundColor: isDark
              ? "rgba(10, 17, 40, 0.8)"
              : "rgba(255, 255, 255, 0.9)",
            border: `1px solid ${
              isDark ? "rgba(74, 26, 74, 0.3)" : "rgba(185, 19, 114, 0.2)"
            }`,
          }}
        >
          {/* Icon Header */}
          <div className="flex justify-center mb-8">
            <div
              className="w-20 h-20 flex items-center justify-center"
              style={{
                background: isDark
                  ? "linear-gradient(135deg, #4a1a4a 0%, #b91372 100%)"
                  : "linear-gradient(135deg, #b91372 0%, #4a1a4a 100%)",
              }}
            >
              <FileSpreadsheet className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1
              className="text-3xl md:text-4xl mb-2"
              style={{ color: isDark ? "#f5f0ff" : "#0a1128" }}
            >
              Upload Excel File
            </h1>
            <p
              className="text-sm opacity-60"
              style={{ color: isDark ? "#f5f0ff" : "#0a1128" }}
            >
              Select or drag and drop your Excel file
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Drag and Drop Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed p-8 md:p-12 text-center transition-all ${
                isDragging ? "scale-105" : ""
              }`}
              style={{
                borderColor: isDragging
                  ? "#b91372"
                  : isDark
                  ? "rgba(74, 26, 74, 0.5)"
                  : "rgba(185, 19, 114, 0.3)",
                backgroundColor: isDragging
                  ? isDark
                    ? "rgba(185, 19, 114, 0.1)"
                    : "rgba(185, 19, 114, 0.05)"
                  : isDark
                  ? "rgba(74, 26, 74, 0.1)"
                  : "rgba(185, 19, 114, 0.02)",
              }}
            >
              {selectedFile ? (
                <div className="space-y-4">
                  <CheckCircle
                    className="w-16 h-16 mx-auto"
                    style={{ color: "#b91372" }}
                  />
                  <div>
                    <p
                      className="text-lg mb-1"
                      style={{ color: isDark ? "#f5f0ff" : "#0a1128" }}
                    >
                      {selectedFile.name}
                    </p>
                    <p
                      className="text-sm opacity-60"
                      style={{ color: isDark ? "#f5f0ff" : "#0a1128" }}
                    >
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                    style={{ color: isDark ? "#b91372" : "#4a1a4a" }}
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload
                    className="w-16 h-16 mx-auto opacity-50"
                    style={{ color: isDark ? "#f5f0ff" : "#0a1128" }}
                  />
                  <div>
                    <label htmlFor="file-upload">
                      <span
                        className="cursor-pointer hover:underline"
                        style={{ color: isDark ? "#b91372" : "#4a1a4a" }}
                      >
                        Click to upload
                      </span>
                      <span
                        className="opacity-60"
                        style={{ color: isDark ? "#f5f0ff" : "#0a1128" }}
                      >
                        {" "}
                        or drag and drop
                      </span>
                    </label>
                    <p
                      className="text-sm opacity-50 mt-2"
                      style={{ color: isDark ? "#f5f0ff" : "#0a1128" }}
                    >
                      Excel files only (.xlsx, .xls)
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!selectedFile}
              className="w-full py-4 transition-all hover:scale-105 hover:shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: isDark
                  ? "linear-gradient(135deg, #4a1a4a 0%, #b91372 100%)"
                  : "linear-gradient(135deg, #b91372 0%, #4a1a4a 100%)",
              }}
            >
              Submit File
            </button>
          </form>
        </div>
      </div>

      {/* Event Name Modal */}
      {showEventNameModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[100]"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="shadow-2xl p-6 md:p-8 max-w-md mx-4 w-full"
            style={{
              backgroundColor: isDark
                ? "rgba(10, 17, 40, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
              border: `2px solid ${
                isDark ? "rgba(74, 26, 74, 0.5)" : "rgba(185, 19, 114, 0.3)"
              }`,
            }}
          >
            <h2
              className="text-xl md:text-2xl mb-3"
              style={{ color: isDark ? "#f5f0ff" : "#0a1128" }}
            >
              Enter Event Name
            </h2>
            <div className="mb-6">
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Event name..."
                className="w-full px-3 md:px-4 py-2.5 md:py-3 transition-all focus:outline-none focus:ring-2 text-sm md:text-base"
                style={{
                  backgroundColor: isDark
                    ? "rgba(74, 26, 74, 0.2)"
                    : "rgba(185, 19, 114, 0.1)",
                  color: isDark ? "#f5f0ff" : "#0a1128",
                  border: isDark
                    ? "1px solid rgba(74, 26, 74, 0.3)"
                    : "1px solid rgba(185, 19, 114, 0.3)",
                }}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowEventNameModal(false)}
                className="px-4 py-2 md:px-6 md:py-2.5 transition-all hover:scale-105 hover:shadow-lg text-sm md:text-base"
                style={{
                  backgroundColor: isDark
                    ? "rgba(74, 26, 74, 0.3)"
                    : "rgba(185, 19, 114, 0.15)",
                  color: isDark ? "#f5f0ff" : "#0a1128",
                  border: `1px solid ${
                    isDark ? "rgba(74, 26, 74, 0.5)" : "rgba(185, 19, 114, 0.3)"
                  }`,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleEventNameSubmit}
                disabled={!eventName}
                className="px-4 py-2 md:px-6 md:py-2.5 transition-all hover:scale-105 hover:shadow-lg text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: isDark
                    ? "linear-gradient(135deg, #4a1a4a 0%, #b91372 100%)"
                    : "linear-gradient(135deg, #b91372 0%, #4a1a4a 100%)",
                  color: "#ffffff",
                  border: "none",
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
