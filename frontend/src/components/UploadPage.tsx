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
  LogOut,
  Info
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEventNameModal, setShowEventNameModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [showReadMeModal, setShowReadMeModal] = useState(false);
  const [sheetLink, setSheetLink] = useState("");
  const linkFilled = sheetLink.trim().length > 0;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkFilled) {
      console.log("Submitting sheet link:", sheetLink);
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
              Submit Attendance Sheet
            </h1>
            <p
              className="text-sm opacity-60"
              style={{ color: isDark ? "#f5f0ff" : "#0a1128" }}
            >
              Enter your Google Sheets link below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Read Me Button and Sheet Link Input */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setShowReadMeModal(true)}
                className="w-full py-3 px-4 flex items-center justify-center gap-2 transition-all hover:scale-105"
                style={{
                  backgroundColor: isDark ? 'rgba(74, 26, 74, 0.3)' : 'rgba(185, 19, 114, 0.15)',
                  color: isDark ? '#f5f0ff' : '#0a1128',
                  border: `1px solid ${isDark ? 'rgba(74, 26, 74, 0.5)' : 'rgba(185, 19, 114, 0.3)'}`
                }}
              >
                <Info className="w-5 h-5" style={{ color: isDark ? '#b91372' : '#4a1a4a' }} />
                <span>Read Me</span>
              </button>

              <div>
                <label 
                  className="block text-sm mb-2"
                  style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
                >
                  Enter Sheet Link
                </label>
                <input
                  type="url"
                  value={sheetLink}
                  onChange={(e) => setSheetLink(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/..."
                  className="w-full px-4 py-3 transition-all focus:outline-none focus:ring-2 text-sm md:text-base"
                  style={{
                    backgroundColor: isDark ? 'rgba(74, 26, 74, 0.2)' : 'rgba(185, 19, 114, 0.1)',
                    color: isDark ? '#f5f0ff' : '#0a1128',
                    border: isDark ? '1px solid rgba(74, 26, 74, 0.3)' : '1px solid rgba(185, 19, 114, 0.3)'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!linkFilled}
              className="w-full py-4 transition-all hover:scale-105 hover:shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: isDark 
                  ? 'linear-gradient(135deg, #4a1a4a 0%, #b91372 100%)'
                  : 'linear-gradient(135deg, #b91372 0%, #4a1a4a 100%)'
              }}
            >
              Submit Sheet
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

      {/* Read Me Modal */}
      {showReadMeModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[100]"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div 
            className="shadow-2xl p-6 md:p-8 max-w-2xl mx-4 w-full max-h-[80vh] overflow-y-auto"
            style={{
              backgroundColor: isDark ? 'rgba(10, 17, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              border: `2px solid ${isDark ? 'rgba(74, 26, 74, 0.5)' : 'rgba(185, 19, 114, 0.3)'}`  
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 
                className="text-xl md:text-2xl"
                style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
              >
                Instructions
              </h2>
              <button
                onClick={() => setShowReadMeModal(false)}
                className="text-2xl opacity-60 hover:opacity-100 transition-opacity"
                style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
              >
                ×
              </button>
            </div>
            
            <div 
              className="space-y-4 text-sm md:text-base"
              style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
            >
              <div>
                <h3 className="font-semibold mb-2" style={{ color: isDark ? '#b91372' : '#4a1a4a' }}>
                  Spreadsheet Format Requirements
                </h3>
                <p className="opacity-80 mb-2">
                  The attendance file must be in spreadsheet format (Google Sheets or Excel).
                </p>
                <p className="opacity-80 mb-2">
                  Ensure the spreadsheet contains the following columns in the exact order:
                </p>
                <ul className="list-decimal list-inside space-y-1 opacity-80 ml-4">
                  <li><strong>name</strong></li>
                  <li><strong>roll_number</strong></li>
                  <li><strong>mail</strong></li>
                  <li><strong>department</strong></li>
                  <li><strong>attendance</strong> (must be a checkbox field)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2" style={{ color: isDark ? '#b91372' : '#4a1a4a' }}>
                  Grant Editor Access
                </h3>
                <p className="opacity-80 mb-2">
                  Add the following email address as an Editor to the spreadsheet:
                </p>
                <div className="flex items-center gap-2 p-3 mt-2" style={{
                  backgroundColor: isDark ? 'rgba(74, 26, 74, 0.2)' : 'rgba(185, 19, 114, 0.1)',
                  border: `1px solid ${isDark ? 'rgba(74, 26, 74, 0.3)' : 'rgba(185, 19, 114, 0.3)'}`
                }}>
                  <code className="flex-1 text-xs md:text-sm break-all" style={{ color: isDark ? '#b91372' : '#4a1a4a' }}>
                    aintnomito@devs-attendance-487205.iam.gserviceaccount.com
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('aintnomito@devs-attendance-487205.iam.gserviceaccount.com');
                      // Optional: Add a toast notification here
                      console.log('Email copied to clipboard');
                    }}
                    className="px-3 py-1 text-xs transition-all hover:scale-105"
                    style={{
                      backgroundColor: isDark ? 'rgba(185, 19, 114, 0.3)' : 'rgba(185, 19, 114, 0.2)',
                      color: isDark ? '#f5f0ff' : '#0a1128',
                      border: `1px solid ${isDark ? 'rgba(185, 19, 114, 0.5)' : 'rgba(185, 19, 114, 0.4)'}`
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2" style={{ color: isDark ? '#b91372' : '#4a1a4a' }}>
                  Submit the Spreadsheet Link
                </h3>
                <p className="opacity-80">
                  After completing the above steps, paste the spreadsheet link into the input box provided below.
                </p>
              </div>

              <div className="pt-4">
                <p className="opacity-60 text-xs md:text-sm">
                  For any issues or questions, please contact the system administrator.
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowReadMeModal(false)}
                className="px-6 py-2.5 transition-all hover:scale-105 hover:shadow-lg text-white"
                style={{
                  background: isDark 
                    ? 'linear-gradient(135deg, #4a1a4a 0%, #b91372 100%)'
                    : 'linear-gradient(135deg, #b91372 0%, #4a1a4a 100%)'
                }}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
