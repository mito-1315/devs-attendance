import { useEffect, useState } from 'react';
import { getCachedUser } from '../services/auth';

interface ProfilePageProps {
  isDark: boolean;
  onBackToUpload: () => void;
}

interface UserData {
  username: string;
  name: string;
  roll_number: string;
  department: string;
  team: string;
  role: string;
}

interface Session {
  id: string;
  name: string;
  status: 'Active' | 'Complete';
}

export function ProfilePage({ isDark, onBackToUpload }: ProfilePageProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock sessions data (30 entries for scrolling)
  const sessions: Session[] = Array.from({ length: 30 }, (_, i) => ({
    id: `SES${String(i + 1).padStart(5, '0')}`,
    name: `Session ${i + 1}`,
    status: i % 3 === 0 ? 'Complete' : 'Active'
  }));

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const cachedUser = getCachedUser();
      const username = cachedUser?.username;
      
      console.log('Cached user from localStorage:', cachedUser);
      console.log('Username extracted:', username);

      if (!username) {
        console.error('No username found in cache');
        setLoading(false);
        return;
      }

      console.log('Request body to send:', { username });

      const response = await fetch('http://localhost:3000/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      
      console.log('Response from backend:', data);

      if (data.success) {
        setUserData(data.user);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full p-4 flex items-center justify-center">
        <p style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 blur-3xl opacity-20"
        style={{
          background: isDark 
            ? 'radial-gradient(circle, #4a1a4a 0%, transparent 70%)'
            : 'radial-gradient(circle, #b91372 0%, transparent 70%)'
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-80 h-80 blur-3xl opacity-15"
        style={{
          background: isDark 
            ? 'radial-gradient(circle, #b91372 0%, transparent 70%)'
            : 'radial-gradient(circle, #4a1a4a 0%, transparent 70%)'
        }}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto relative z-1 pt-20">
        <div 
          className="shadow-2xl p-6 mt-10 md:p-10 backdrop-blur-sm"
          style={{
            backgroundColor: isDark ? 'rgba(10, 17, 40, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            border: `1px solid ${isDark ? 'rgba(74, 26, 74, 0.3)' : 'rgba(185, 19, 114, 0.2)'}`
          }}
        >
          {/* Header */}
          <h1 
            className="text-3xl md:text-4xl mb-8"
            style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
          >
            Profile
          </h1>

          {/* User Info Section */}
          <div 
            className="p-6 mb-6"
            style={{
              backgroundColor: isDark ? 'rgba(74, 26, 74, 0.2)' : 'rgba(185, 19, 114, 0.1)',
              border: `1px solid ${isDark ? 'rgba(74, 26, 74, 0.3)' : 'rgba(185, 19, 114, 0.2)'}`
            }}
          >{/* First Row: Username, Name, Roll Number */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p 
                  className="text-sm opacity-60 mb-1"
                  style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
                >
                  Username
                </p>
                <p 
                  className="text-lg"
                  style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
                >
                  {userData?.username || 'N/A'}
                </p>
              </div>
              <div>
                <p 
                  className="text-sm opacity-60 mb-1"
                  style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
                >
                  Name
                </p>
                <p 
                  className="text-lg"
                  style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
                >
                  {userData?.name || 'N/A'}
                </p>
              </div>
              <div>
                <p 
                  className="text-sm opacity-60 mb-1"
                  style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
                >
                  Roll Number
                </p>
                <p 
                  className="text-lg"
                  style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
                >
                  {userData?.roll_number || 'N/A'}
                </p>
              </div>
            </div>

            {/* Second Row: Department, Role, Team */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p 
                  className="text-sm opacity-60 mb-1"
                  style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
                >
                  Department
                </p>
                <p 
                  className="text-lg"
                  style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
                >
                  {userData?.department || 'N/A'}
                </p>
              </div>
              <div>
                <p 
                  className="text-sm opacity-60 mb-1"
                  style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
                >
                  Role
                </p>
                <p 
                  className="text-lg"
                  style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
                >
                  {userData?.role || 'N/A'}
                </p>
              </div>
              <div>
                <p 
                  className="text-sm opacity-60 mb-1"
                  style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
                >
                  Team
                </p>
                <p 
                  className="text-lg"
                  style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
                >
                  {userData?.team || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Sessions Section */}
          <div>
            <h2 
              className="text-xl md:text-2xl mb-4"
              style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
            >
              Sessions Created
            </h2>
            
            {/* Scrollable Sessions List */}
            <div 
              className="overflow-y-auto"
              style={{
                maxHeight: '400px',
                scrollbarWidth: 'thin',
                scrollbarColor: isDark 
                  ? '#b91372 rgba(74, 26, 74, 0.2)' 
                  : '#4a1a4a rgba(185, 19, 114, 0.1)',
              }}
            >
              <style>
                {`
                  div::-webkit-scrollbar {
                    width: 8px;
                  }
                  div::-webkit-scrollbar-track {
                    background: ${isDark ? 'rgba(74, 26, 74, 0.2)' : 'rgba(185, 19, 114, 0.1)'};
                  }
                  div::-webkit-scrollbar-thumb {
                    background: ${isDark ? '#b91372' : '#4a1a4a'};
                  }
                  div::-webkit-scrollbar-thumb:hover {
                    background: ${isDark ? '#d01582' : '#5a2a5a'};
                  }
                `}
              </style>
              
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4"
                    style={{
                      backgroundColor: isDark ? 'rgba(74, 26, 74, 0.15)' : 'rgba(185, 19, 114, 0.08)',
                      border: `1px solid ${isDark ? 'rgba(74, 26, 74, 0.3)' : 'rgba(185, 19, 114, 0.2)'}`
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 
                        className="text-base md:text-lg"
                        style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
                      >
                        {session.name}
                      </h3>
                      <span
                        className="text-xs px-2 py-1"
                        style={{
                          backgroundColor: session.status === 'Active'
                            ? isDark ? 'rgba(74, 185, 27, 0.2)' : 'rgba(74, 185, 27, 0.15)'
                            : isDark ? 'rgba(74, 26, 74, 0.3)' : 'rgba(185, 19, 114, 0.15)',
                          color: session.status === 'Active'
                            ? isDark ? '#6fd147' : '#4a9c2e'
                            : isDark ? '#f5f0ff' : '#0a1128'
                        }}
                      >
                        {session.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p 
                        className="text-sm opacity-60"
                        style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
                      >
                        Session ID:
                      </p>
                      <p 
                        className="text-sm select-none"
                        style={{ 
                          color: isDark ? '#b91372' : '#4a1a4a',
                          userSelect: 'none',
                          WebkitUserSelect: 'none',
                          MozUserSelect: 'none',
                          msUserSelect: 'none'
                        }}
                      >
                        {session.id}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
