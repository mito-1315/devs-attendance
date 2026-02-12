import { useState, useEffect } from "react";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import { LoginPage } from "./components/LoginPage";
import { UploadPage } from "./components/UploadPage";
import { AttendancePage } from "./components/AttendancePage";
import { HistoryPage } from "./components/HistoryPage";
import { SessionPage } from "./components/SessionPage";
import { EventStatsBasics } from "./components/EventStatsBasics";
import { ProfilePage } from "./components/ProfilePage";
import { CreateUserPage } from "./components/CreateUserPage";
import { getAuthState, logout } from "./services/auth";

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [showEventStats, setShowEventStats] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [eventName, setEventName] = useState("");

  // Check for cached authentication on mount
  useEffect(() => {
    const authState = getAuthState();
    if (authState.isAuthenticated) {
      setIsLoggedIn(true);
    }
    setIsInitializing(false);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setShowAttendance(false);
    setShowHistory(false);
    setShowSessions(false);
    setShowEventStats(false);
    setShowProfile(false);
    setShowCreateUser(false);
    setShowBackConfirm(false);
  };

  const handleNavigateToAttendance = (name: string) => {
    setEventName(name);
    setShowAttendance(true);
    setShowSessions(false);
  };

  const handleNavigateToHistory = () => {
    setShowHistory(true);
  };

  const handleNavigateToSessions = () => {
    setShowSessions(true);
    setShowAttendance(false);
  };

  const handleNavigateToProfile = () => {
    setShowProfile(true);
  };

  const handleNavigateToCreateUser = () => {
    setShowCreateUser(true);
  };

  const handleNavigateToEventStats = (name: string) => {
    setEventName(name);
    setShowEventStats(true);
    setShowHistory(false);
  };

  const handleBackToHistory = () => {
    setShowEventStats(false);
    setShowHistory(true);
  };

  const handleBackToUpload = () => {
    setShowAttendance(false);
    setShowHistory(false);
    setShowSessions(false);
    setShowEventStats(false);
    setShowProfile(false);
    setShowCreateUser(false);
    setShowBackConfirm(false);
  };

  const handleBackClick = () => {
    setShowBackConfirm(true);
  };

  // Show loading screen while checking authentication
  if (isInitializing) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{ backgroundColor: isDark ? "#0a1128" : "#f5f0ff" }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{
              borderColor: isDark ? "#b91372" : "#4a1a4a",
              borderTopColor: "transparent",
            }}
          />
          <p style={{ color: isDark ? "#f5f0ff" : "#0a1128" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full transition-colors"
      style={{ backgroundColor: isDark ? "#0a1128" : "#f5f0ff" }}
    >
      {/* Theme Toggle Button */}
      <div className="fixed top-16 right-4 z-50">
        <button
          onClick={() => setIsDark(!isDark)}
          className="flex items-center justify-center gap-2 w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-2 transition-all hover:scale-105"
          style={{
            backgroundColor: isDark ? "#4a1a4a" : "#b91372",
            color: isDark ? "#f5f0ff" : "#FFFFFF",
          }}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="hidden md:inline">
            {isDark ? "Light" : "Dark"} Mode
          </span>
        </button>
      </div>

      {showAttendance && isLoggedIn && (
        <div className="fixed top-16 left-4 z-50">
          <button
            onClick={handleBackClick}
            className="flex items-center justify-center gap-2 w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-2 transition-all hover:scale-105"
            style={{
              background: isDark
                ? "linear-gradient(135deg, #4a1a4a 0%, #b91372 100%)"
                : "linear-gradient(135deg, #b91372 0%, #4a1a4a 100%)",
              color: "#ffffff",
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline">Back</span>
          </button>
        </div>
      )}

      {showHistory && isLoggedIn && (
        <div className="fixed top-16 left-4 z-50">
          <button
            onClick={handleBackToUpload}
            className="flex items-center justify-center gap-2 w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-2 transition-all hover:scale-105"
            style={{
              background: isDark
                ? "linear-gradient(135deg, #4a1a4a 0%, #b91372 100%)"
                : "linear-gradient(135deg, #b91372 0%, #4a1a4a 100%)",
              color: "#ffffff",
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline">Back</span>
          </button>
        </div>
      )}

      {showSessions && isLoggedIn && (
        <div className="fixed top-16 left-4 z-50">
          <button
            onClick={handleBackToUpload}
            className="flex items-center justify-center gap-2 w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-2 transition-all hover:scale-105"
            style={{
              background: isDark
                ? "linear-gradient(135deg, #4a1a4a 0%, #b91372 100%)"
                : "linear-gradient(135deg, #b91372 0%, #4a1a4a 100%)",
              color: "#ffffff",
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline">Back</span>
          </button>
        </div>
      )}

      {showEventStats && isLoggedIn && (
        <div className="fixed top-16 left-4 z-50">
          <button
            onClick={handleBackToHistory}
            className="flex items-center justify-center gap-2 w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-2 transition-all hover:scale-105"
            style={{
              background: isDark
                ? "linear-gradient(135deg, #4a1a4a 0%, #b91372 100%)"
                : "linear-gradient(135deg, #b91372 0%, #4a1a4a 100%)",
              color: "#ffffff",
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline">Back</span>
          </button>
        </div>
      )}

      {showProfile && isLoggedIn && (
        <div className="fixed top-16 left-4 z-50">
          <button
            onClick={handleBackToUpload}
            className="flex items-center justify-center gap-2 w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-2 transition-all hover:scale-105"
            style={{
              background: isDark
                ? "linear-gradient(135deg, #4a1a4a 0%, #b91372 100%)"
                : "linear-gradient(135deg, #b91372 0%, #4a1a4a 100%)",
              color: "#ffffff",
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline">Back</span>
          </button>
        </div>
      )}

      {showCreateUser && isLoggedIn && (
        <div className="fixed top-16 left-4 z-50">
          <button
            onClick={handleBackToUpload}
            className="flex items-center justify-center gap-2 w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-2 transition-all hover:scale-105"
            style={{
              background: isDark
                ? "linear-gradient(135deg, #4a1a4a 0%, #b91372 100%)"
                : "linear-gradient(135deg, #b91372 0%, #4a1a4a 100%)",
              color: "#ffffff",
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline">Back</span>
          </button>
        </div>
      )}

      {!isLoggedIn ? (
        <LoginPage isDark={isDark} onLogin={handleLogin} />
      ) : showAttendance ? (
        <AttendancePage
          isDark={isDark}
          onBackToUpload={handleBackToUpload}
          eventName={eventName}
        />
      ) : showEventStats ? (
        <EventStatsBasics
          isDark={isDark}
          onBackToHistory={handleBackToHistory}
          eventName={eventName}
        />
      ) : showHistory ? (
        <HistoryPage
          isDark={isDark}
          onBackToUpload={handleBackToUpload}
          onNavigateToEventStats={handleNavigateToEventStats}
        />
      ) : showSessions ? (
        <SessionPage
          isDark={isDark}
          onNavigateToAttendance={handleNavigateToAttendance}
        />
      ) : showProfile ? (
        <ProfilePage isDark={isDark} onBackToUpload={handleBackToUpload} />
      ) : showCreateUser ? (
        <CreateUserPage isDark={isDark} />
      ) : (
        <UploadPage
          isDark={isDark}
          onNavigateToAttendance={handleNavigateToAttendance}
          onNavigateToHistory={handleNavigateToHistory}
          onNavigateToSessions={handleNavigateToSessions}
          onNavigateToProfile={handleNavigateToProfile}
          onNavigateToCreateUser={handleNavigateToCreateUser}
          onLogout={handleLogout}
        />
      )}

      {/* Back Confirmation Dialog */}
      {showBackConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[100]"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="shadow-2xl p-6 md:p-8 max-w-md mx-4"
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
              Confirm Navigation
            </h2>
            <p
              className="text-sm md:text-base opacity-75 mb-6"
              style={{ color: isDark ? "#f5f0ff" : "#0a1128" }}
            >
              All the attendance marked will be destroyed. Make sure to commit
              before you go back.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowBackConfirm(false)}
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
                onClick={handleBackToUpload}
                className="px-4 py-2 md:px-6 md:py-2.5 transition-all hover:scale-105 hover:shadow-lg text-sm md:text-base"
                style={{
                  background: isDark
                    ? "linear-gradient(135deg, #4a1a4a 0%, #b91372 100%)"
                    : "linear-gradient(135deg, #b91372 0%, #4a1a4a 100%)",
                  color: "#ffffff",
                  border: "none",
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
