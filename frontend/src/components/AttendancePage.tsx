import { useState } from 'react';
import { Search, Users, UserCheck, UserX, Save, UserPlus, Download, Copy, Check } from 'lucide-react';

interface AttendancePageProps {
  isDark: boolean;
  onBackToUpload: () => void;
  eventName: string;
}

interface Student {
  id: number;
  rollNumber: string;
  name: string;
  department: string;
  isPresent: boolean;
  isOnSpot?: boolean;
}

export function AttendancePage({ isDark, onBackToUpload, eventName }: AttendancePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCommitConfirm, setShowCommitConfirm] = useState(false);
  const [showAddNewModal, setShowAddNewModal] = useState(false);
  const [nextId, setNextId] = useState(31); // Track next available ID
  const [copied, setCopied] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    rollNumber: '',
    department: ''
  });
  // Generate a unique session code once and keep it constant
  const [sessionCode] = useState(() => `#${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  const [students, setStudents] = useState<Student[]>([
    { id: 1, rollNumber: '2021001', name: 'John Doe', department: 'Computer Science', isPresent: false },
    { id: 2, rollNumber: '2021002', name: 'Jane Smith', department: 'Mathematics', isPresent: false },
    { id: 3, rollNumber: '2021003', name: 'Alice Johnson', department: 'Physics', isPresent: false },
    { id: 4, rollNumber: '2021004', name: 'Bob Brown', department: 'Chemistry', isPresent: false },
    { id: 5, rollNumber: '2021005', name: 'Charlie Davis', department: 'Biology', isPresent: false },
    { id: 6, rollNumber: '2021006', name: 'Diana Evans', department: 'History', isPresent: false },
    { id: 7, rollNumber: '2021007', name: 'Ethan Foster', department: 'Geography', isPresent: false },
    { id: 8, rollNumber: '2021008', name: 'Fiona Green', department: 'Economics', isPresent: false },
    { id: 9, rollNumber: '2021009', name: 'George Harris', department: 'Political Science', isPresent: false },
    { id: 10, rollNumber: '2021010', name: 'Hannah Jackson', department: 'Sociology', isPresent: false },
    { id: 11, rollNumber: '2021011', name: 'Ian King', department: 'Psychology', isPresent: false },
    { id: 12, rollNumber: '2021012', name: 'Jenna Lee', department: 'Art History', isPresent: false },
    { id: 13, rollNumber: '2021013', name: 'Kevin Martin', department: 'Music', isPresent: false },
    { id: 14, rollNumber: '2021014', name: 'Lily Nelson', department: 'Theater', isPresent: false },
    { id: 15, rollNumber: '2021015', name: 'Mason O\'Connor', department: 'Film Studies', isPresent: false },
    { id: 16, rollNumber: '2021016', name: 'Nina Patel', department: 'Dance', isPresent: false },
    { id: 17, rollNumber: '2021017', name: 'Oliver Quinn', department: 'Photography', isPresent: false },
    { id: 18, rollNumber: '2021018', name: 'Penelope Reed', department: 'Graphic Design', isPresent: false },
    { id: 19, rollNumber: '2021019', name: 'Quinn Smith', department: 'Illustration', isPresent: false },
    { id: 20, rollNumber: '2021020', name: 'Rachel Taylor', department: 'Animation', isPresent: false },
    { id: 21, rollNumber: '2021021', name: 'Samuel White', department: 'Game Design', isPresent: false },
    { id: 22, rollNumber: '2021022', name: 'Tara Xu', department: 'Virtual Reality', isPresent: false },
    { id: 23, rollNumber: '2021023', name: 'Uma Yoon', department: 'Augmented Reality', isPresent: false },
    { id: 24, rollNumber: '2021024', name: 'Victor Zhang', department: 'Robotics', isPresent: false },
    { id: 25, rollNumber: '2021025', name: 'Wendy Zhou', department: 'Cybersecurity', isPresent: false },
    { id: 26, rollNumber: '2021026', name: 'Xander Yu', department: 'Data Science', isPresent: false },
    { id: 27, rollNumber: '2021027', name: 'Yara Zane', department: 'Machine Learning', isPresent: false },
    { id: 28, rollNumber: '2021028', name: 'Zane Wang', department: 'Artificial Intelligence', isPresent: false },
    { id: 29, rollNumber: '2021029', name: 'Aaron Lee', department: 'Software Engineering', isPresent: false },
    { id: 30, rollNumber: '2021030', name: 'Bella Chen', department: 'Network Security', isPresent: false },
  ]);

  const handleCopyCode = () => {
    // Fallback method for copying text (compatible with all browsers)
    const textArea = document.createElement('textarea');
    textArea.value = sessionCode;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    
    document.body.removeChild(textArea);
  };

  const toggleAttendance = (id: number) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, isPresent: !student.isPresent } : student
    ));
  };

  const handleCommit = () => {
    setShowCommitConfirm(true);
  };

  const handleConfirmCommit = () => {
    // Remove students marked as present
    setStudents(students.filter(student => !student.isPresent));
    setShowCommitConfirm(false);
  };

  const handleCancelCommit = () => {
    setShowCommitConfirm(false);
  };

  const filteredStudents = students.filter(student =>
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPresent = students.filter(s => s.isPresent).length;
  const totalAbsent = students.length - totalPresent;
  const totalOnSpot = students.filter(s => s.isOnSpot).length;

  return (
    <div className="h-screen w-full flex items-center justify-center px-4 py-20 md:py-8 overflow-hidden relative">
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

      <div 
        className="w-full max-w-3xl relative mt-20 z-10 shadow-2xl px-4 py-3 md:px-6 md:py-2 backdrop-blur-sm flex flex-col gap-4 md:gap-5"
        style={{
          backgroundColor: isDark ? 'rgba(10, 17, 40, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          border: `1px solid ${isDark ? 'rgba(74, 26, 74, 0.3)' : 'rgba(185, 19, 114, 0.2)'}`,
          maxHeight: 'calc(100vh - 120px)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className="text-xl md:text-2xl truncate max-w-full"
              style={{ 
                color: isDark ? '#f5f0ff' : '#0a1128',
                fontSize: eventName.length > 30 ? 'clamp(1rem, 4vw, 1.5rem)' : undefined
              }}
            >
              {eventName}
            </h1>
          </div>
          
          {/* Session Code - Click to Copy */}
          <div 
            onClick={handleCopyCode}
            className="p-2 md:p-3 cursor-pointer transition-all hover:scale-[1.02] flex items-center gap-2"
            style={{
              backgroundColor: isDark ? 'rgba(74, 26, 74, 0.2)' : 'rgba(185, 19, 114, 0.1)',
              border: `1px solid ${isDark ? 'rgba(74, 26, 74, 0.3)' : 'rgba(185, 19, 114, 0.3)'}` 
            }}
          >
            <p 
              className="text-sm md:text-lg font-semibold"
              style={{ color: isDark ? '#b91372' : '#4a1a4a' }}
            >
              {sessionCode}
            </p>
            {copied ? (
              <Check className="w-4 h-4 md:w-5 md:h-5" style={{ color: '#22c55e' }} />
            ) : (
              <Copy className="w-4 h-4 md:w-5 md:h-5 opacity-50" style={{ color: isDark ? '#f5f0ff' : '#0a1128' }} />
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          <div 
            className="p-2 md:p-3"
            style={{
              backgroundColor: isDark ? 'rgba(74, 26, 74, 0.2)' : 'rgba(185, 19, 114, 0.1)',
              border: `1px solid ${isDark ? 'rgba(74, 26, 74, 0.3)' : 'rgba(185, 19, 114, 0.3)'}`
            }}
          >
            <div className="flex items-center gap-1 md:gap-1.5 mb-1">
              <Users className="w-4 h-4 md:w-5 md:h-5" style={{ color: isDark ? '#b91372' : '#4a1a4a' }} />
              <p className="text-xs opacity-60" style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}>Registered</p>
            </div>
            <p className="text-xl md:text-2xl font-semibold" style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}>{students.length}</p>
          </div>
          <div 
            className="p-2 md:p-3"
            style={{
              backgroundColor: isDark ? 'rgba(74, 26, 74, 0.2)' : 'rgba(185, 19, 114, 0.1)',
              border: `1px solid ${isDark ? 'rgba(74, 26, 74, 0.3)' : 'rgba(185, 19, 114, 0.3)'}`
            }}
          >
            <div className="flex items-center gap-1 md:gap-1.5 mb-1">
              <UserPlus className="w-4 h-4 md:w-5 md:h-5" style={{ color: isDark ? '#fbbf24' : '#f59e0b' }} />
              <p className="text-xs opacity-60" style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}>On-Spot</p>
            </div>
            <p className="text-xl md:text-2xl font-semibold" style={{ color: isDark ? '#fbbf24' : '#f59e0b' }}>{totalOnSpot}</p>
          </div>
          <div 
            className="p-2 md:p-3"
            style={{
              backgroundColor: isDark ? 'rgba(74, 26, 74, 0.2)' : 'rgba(185, 19, 114, 0.1)',
              border: `1px solid ${isDark ? 'rgba(74, 26, 74, 0.3)' : 'rgba(185, 19, 114, 0.3)'}`
            }}
          >
            <div className="flex items-center gap-1 md:gap-1.5 mb-1">
              <UserCheck className="w-4 h-4 md:w-5 md:h-5" style={{ color: isDark ? '#4ade80' : '#22c55e' }} />
              <p className="text-xs opacity-60" style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}>Present</p>
            </div>
            <p className="text-xl md:text-2xl font-semibold" style={{ color: isDark ? '#4ade80' : '#22c55e' }}>{totalPresent}</p>
          </div>
          <div 
            className="p-2 md:p-3"
            style={{
              backgroundColor: isDark ? 'rgba(74, 26, 74, 0.2)' : 'rgba(185, 19, 114, 0.1)',
              border: `1px solid ${isDark ? 'rgba(74, 26, 74, 0.3)' : 'rgba(185, 19, 114, 0.3)'}`
            }}
          >
            <div className="flex items-center gap-1 md:gap-1.5 mb-1">
              <UserX className="w-4 h-4 md:w-5 md:h-5" style={{ color: isDark ? '#f87171' : '#ef4444' }} />
              <p className="text-xs opacity-60" style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}>Absent</p>
            </div>
            <p className="text-xl md:text-2xl font-semibold" style={{ color: isDark ? '#f87171' : '#ef4444' }}>{totalAbsent}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div>
          <label 
            htmlFor="search" 
            className="block mb-2 text-sm md:text-base opacity-75"
            style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
          >
            Search Student
          </label>
          <div className="relative">
            <Search 
              className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 opacity-50"
              style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
            />
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by roll number..."
              className="w-full pl-11 md:pl-14 pr-3 md:pr-4 py-2.5 md:py-3 transition-all focus:outline-none focus:ring-2 text-sm md:text-base"
              style={{
                backgroundColor: isDark ? 'rgba(74, 26, 74, 0.2)' : 'rgba(185, 19, 114, 0.1)',
                color: isDark ? '#f5f0ff' : '#0a1128',
                border: isDark ? '1px solid rgba(74, 26, 74, 0.3)' : '1px solid rgba(185, 19, 114, 0.3)'
              }}
            />
          </div>
        </div>

        {/* Attendance Table */}
        <div 
          className="overflow-hidden flex flex-col flex-1"
          style={{
            backgroundColor: isDark ? 'rgba(26, 34, 56, 0.5)' : 'rgba(255, 255, 255, 0.5)',
            border: `2px solid ${isDark ? 'rgba(74, 26, 74, 0.4)' : 'rgba(185, 19, 114, 0.3)'}`
          }}
        >
          {/* Table Header */}
          <div 
            className="grid grid-cols-3 p-3 md:p-4"
            style={{
              background: isDark 
                ? 'linear-gradient(135deg, #4a1a4a 0%, #b91372 100%)'
                : 'linear-gradient(135deg, #b91372 0%, #4a1a4a 100%)',
              color: '#ffffff',
              borderBottom: `2px solid ${isDark ? 'rgba(74, 26, 74, 0.5)' : 'rgba(185, 19, 114, 0.4)'}`
            }}
          >
            <div className="text-sm md:text-base flex items-center justify-center border-r" style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}>Roll Number</div>
            <div className="text-sm md:text-base flex items-center justify-center border-r" style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}>Toggle</div>
            <div className="text-sm md:text-base flex items-center justify-center">Status</div>
          </div>

          {/* Table Body */}
          <div 
            className="overflow-y-auto flex-1"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              maxHeight: '250px'
            }}
          >
            <style>{`
              .overflow-y-auto::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {filteredStudents.map((student, index) => (
              <div
                key={student.id}
                className="grid grid-cols-3"
                style={{
                  borderTop: index === 0 ? 'none' : `1px solid ${isDark ? 'rgba(74, 26, 74, 0.4)' : 'rgba(185, 19, 114, 0.2)'}`,
                  color: isDark ? '#f5f0ff' : '#0a1128',
                  backgroundColor: student.isPresent 
                    ? (isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)') 
                    : (isDark ? 'rgba(10, 17, 40, 0.3)' : 'rgba(255, 255, 255, 0.3)'),
                  minHeight: '60px'
                }}
              >
                <div className="flex items-center justify-center text-sm md:text-base border-r px-2 py-3 md:py-4" style={{ borderColor: isDark ? 'rgba(74, 26, 74, 0.3)' : 'rgba(185, 19, 114, 0.2)' }}>
                  {student.rollNumber}
                </div>
                <div className="flex items-center justify-center border-r px-2 py-3 md:py-4" style={{ borderColor: isDark ? 'rgba(74, 26, 74, 0.3)' : 'rgba(185, 19, 114, 0.2)' }}>
                  <button
                    onClick={() => toggleAttendance(student.id)}
                    className="px-3 py-1.5 md:px-4 md:py-2 transition-all hover:scale-105 hover:shadow-lg text-xs md:text-sm"
                    style={{
                      background: isDark 
                        ? 'linear-gradient(135deg, #4a1a4a 0%, #b91372 100%)'
                        : 'linear-gradient(135deg, #b91372 0%, #4a1a4a 100%)',
                      color: '#ffffff',
                      border: 'none'
                    }}
                  >
                    Toggle
                  </button>
                </div>
                <div className="flex items-center justify-center text-sm md:text-base px-2 py-3 md:py-4">
                  <span
                    style={{
                      color: student.isPresent 
                        ? (isDark ? '#4ade80' : '#22c55e')
                        : (isDark ? '#f87171' : '#ef4444')
                    }}
                  >
                    {student.isPresent ? 'Present' : 'Absent'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <button
            className="flex items-center justify-center gap-2 px-4 py-1.5 md:py-2 transition-all hover:scale-105 hover:shadow-lg text-sm md:text-base"
            style={{
              background: isDark 
                ? 'linear-gradient(135deg, #4a1a4a 0%, #b91372 100%)'
                : 'linear-gradient(135deg, #b91372 0%, #4a1a4a 100%)',
              color: '#ffffff',
              border: 'none'
            }}
            onClick={handleCommit}
          >
            <Save className="w-4 h-4 md:w-5 md:h-5" />
            <span>Commit</span>
          </button>
          <button
            className="flex items-center justify-center gap-2 px-4 py-1.5 md:py-2 transition-all hover:scale-105 hover:shadow-lg text-sm md:text-base"
            style={{
              background: isDark 
                ? 'linear-gradient(135deg, #4a1a4a 0%, #b91372 100%)'
                : 'linear-gradient(135deg, #b91372 0%, #4a1a4a 100%)',
              color: '#ffffff',
              border: 'none'
            }}
            onClick={() => setShowAddNewModal(true)}
          >
            <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
            <span>Add</span>
          </button>
          <button
            className="flex items-center justify-center gap-2 px-4 py-1.5 md:py-2 transition-all hover:scale-105 hover:shadow-lg text-sm md:text-base"
            style={{
              background: isDark 
                ? 'linear-gradient(135deg, #4a1a4a 0%, #b91372 100%)'
                : 'linear-gradient(135deg, #b91372 0%, #4a1a4a 100%)',
              color: '#ffffff',
              border: 'none'
            }}
          >
            <Download className="w-4 h-4 md:w-5 md:h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>
      {/* Commit Confirmation Modal */}
      {showCommitConfirm && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-[100]"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)'
            }}
          >
            <div 
              className="shadow-2xl p-6 md:p-8 max-w-md mx-4"
              style={{
                backgroundColor: isDark ? 'rgba(10, 17, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                border: `2px solid ${isDark ? 'rgba(74, 26, 74, 0.5)' : 'rgba(185, 19, 114, 0.3)'}`
              }}
            >
              <h2 
                className="text-xl md:text-2xl mb-3"
                style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
              >
                Confirm Commit
              </h2>
              <p 
                className="text-sm md:text-base opacity-75 mb-6"
                style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
              >
                Committing will permanently remove the roll numbers marked as Present from the attendance page. This action is irreversible.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancelCommit}
                  className="px-4 py-2 md:px-6 md:py-2.5 transition-all hover:scale-105 hover:shadow-lg text-sm md:text-base"
                  style={{
                    backgroundColor: isDark ? 'rgba(74, 26, 74, 0.3)' : 'rgba(185, 19, 114, 0.15)',
                    color: isDark ? '#f5f0ff' : '#0a1128',
                    border: `1px solid ${isDark ? 'rgba(74, 26, 74, 0.5)' : 'rgba(185, 19, 114, 0.3)'}`
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCommit}
                  className="px-4 py-2 md:px-6 md:py-2.5 transition-all hover:scale-105 hover:shadow-lg text-sm md:text-base"
                  style={{
                    background: isDark 
                      ? 'linear-gradient(135deg, #4a1a4a 0%, #b91372 100%)'
                      : 'linear-gradient(135deg, #b91372 0%, #4a1a4a 100%)',
                    color: '#ffffff',
                    border: 'none'
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      {/* Add New Student Modal */}
      {showAddNewModal && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-[100]"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)'
            }}
          >
            <div 
              className="shadow-2xl p-6 md:p-8 max-w-md mx-4"
              style={{
                backgroundColor: isDark ? 'rgba(10, 17, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                border: `2px solid ${isDark ? 'rgba(74, 26, 74, 0.5)' : 'rgba(185, 19, 114, 0.3)'}`
              }}
            >
              <h2 
                className="text-xl md:text-2xl mb-3"
                style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
              >
                Add New Student
              </h2>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label 
                    htmlFor="name" 
                    className="block mb-2 text-sm md:text-base opacity-75"
                    style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    placeholder="Enter student name..."
                    className="w-full pl-3 md:pl-4 pr-3 md:pr-4 py-2.5 md:py-3 transition-all focus:outline-none focus:ring-2 text-sm md:text-base"
                    style={{
                      backgroundColor: isDark ? 'rgba(74, 26, 74, 0.2)' : 'rgba(185, 19, 114, 0.1)',
                      color: isDark ? '#f5f0ff' : '#0a1128',
                      border: isDark ? '1px solid rgba(74, 26, 74, 0.3)' : '1px solid rgba(185, 19, 114, 0.3)'
                    }}
                  />
                </div>
                <div>
                  <label 
                    htmlFor="rollNumber" 
                    className="block mb-2 text-sm md:text-base opacity-75"
                    style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
                  >
                    Roll Number
                  </label>
                  <input
                    id="rollNumber"
                    type="text"
                    value={newStudent.rollNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                    placeholder="Enter roll number..."
                    className="w-full pl-3 md:pl-4 pr-3 md:pr-4 py-2.5 md:py-3 transition-all focus:outline-none focus:ring-2 text-sm md:text-base"
                    style={{
                      backgroundColor: isDark ? 'rgba(74, 26, 74, 0.2)' : 'rgba(185, 19, 114, 0.1)',
                      color: isDark ? '#f5f0ff' : '#0a1128',
                      border: isDark ? '1px solid rgba(74, 26, 74, 0.3)' : '1px solid rgba(185, 19, 114, 0.3)'
                    }}
                  />
                </div>
                <div>
                  <label 
                    htmlFor="department" 
                    className="block mb-2 text-sm md:text-base opacity-75"
                    style={{ color: isDark ? '#f5f0ff' : '#0a1128' }}
                  >
                    Department
                  </label>
                  <input
                    id="department"
                    type="text"
                    value={newStudent.department}
                    onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                    placeholder="Enter department..."
                    className="w-full pl-3 md:pl-4 pr-3 md:pr-4 py-2.5 md:py-3 transition-all focus:outline-none focus:ring-2 text-sm md:text-base"
                    style={{
                      backgroundColor: isDark ? 'rgba(74, 26, 74, 0.2)' : 'rgba(185, 19, 114, 0.1)',
                      color: isDark ? '#f5f0ff' : '#0a1128',
                      border: isDark ? '1px solid rgba(74, 26, 74, 0.3)' : '1px solid rgba(185, 19, 114, 0.3)'
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <button
                  onClick={() => setShowAddNewModal(false)}
                  className="px-4 py-2 md:px-6 md:py-2.5 transition-all hover:scale-105 hover:shadow-lg text-sm md:text-base"
                  style={{
                    backgroundColor: isDark ? 'rgba(74, 26, 74, 0.3)' : 'rgba(185, 19, 114, 0.15)',
                    color: isDark ? '#f5f0ff' : '#0a1128',
                    border: `1px solid ${isDark ? 'rgba(74, 26, 74, 0.5)' : 'rgba(185, 19, 114, 0.3)'}`
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setStudents([...students, { ...newStudent, id: nextId, isPresent: true, isOnSpot: true }]);
                    setNextId(nextId + 1); // Increment next available ID
                    setShowAddNewModal(false);
                    setNewStudent({ name: '', rollNumber: '', department: '' });
                  }}
                  className="px-4 py-2 md:px-6 md:py-2.5 transition-all hover:scale-105 hover:shadow-lg text-sm md:text-base"
                  style={{
                    background: isDark 
                      ? 'linear-gradient(135deg, #4a1a4a 0%, #b91372 100%)'
                      : 'linear-gradient(135deg, #b91372 0%, #4a1a4a 100%)',
                    color: '#ffffff',
                    border: 'none'
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}