import React, { useState, useEffect } from 'react';
import { CurrentUser, School, TeacherClassData, Student, AttendanceRecord, GradeRecord } from '../types';
import { getTeacherClassesData, recordAttendance, recordGrade } from '../services/dataService';

interface TeacherDashboardProps {
  school: School;
  currentUser: CurrentUser;
  onLogout: () => void;
}

type TeacherTab = 'classes' | 'attendance' | 'grades' | 'messages' | 'resources' | 'reports';

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  school, 
  currentUser, 
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<TeacherTab>('classes');
  const [classesData, setClassesData] = useState<TeacherClassData[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [gradeForm, setGradeForm] = useState({
    studentId: '',
    subject: '',
    assessment: 'test',
    score: '',
    maxScore: '100'
  });

  useEffect(() => {
    loadClassesData();
  }, [currentUser]);

  useEffect(() => {
    if (classesData.length > 0 && !selectedClass) {
      setSelectedClass(classesData[0].class);
    }
  }, [classesData]);

  const loadClassesData = async () => {
    try {
      setLoading(true);
      const data = await getTeacherClassesData(currentUser);
      setClassesData(data);
    } catch (error) {
      console.error('Failed to load teacher classes data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceSubmit = async (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    try {
      await recordAttendance(currentUser, {
        studentId,
        date: attendanceDate,
        status,
        class: selectedClass
      });
      
      // Refresh data or update local state
      await loadClassesData();
    } catch (error) {
      console.error('Failed to record attendance:', error);
    }
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await recordGrade(currentUser, {
        studentId: gradeForm.studentId,
        subject: gradeForm.subject,
        assessment: gradeForm.assessment as any,
        score: parseFloat(gradeForm.score),
        maxScore: parseFloat(gradeForm.maxScore),
        date: new Date().toISOString(),
        term: school.currentTerm as any,
        session: school.currentSession,
        class: selectedClass
      });
      
      setGradeForm({
        studentId: '',
        subject: '',
        assessment: 'test',
        score: '',
        maxScore: '100'
      });
      
      await loadClassesData();
    } catch (error) {
      console.error('Failed to record grade:', error);
    }
  };

  const getCurrentClassData = () => {
    return classesData.find(c => c.class === selectedClass);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  const renderClassesTab = () => {
    const currentClass = getCurrentClassData();
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-primary">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="stat-title">Total Classes</div>
            <div className="stat-value text-primary">{classesData.length}</div>
          </div>

          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-secondary">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="stat-title">Students in {selectedClass}</div>
            <div className="stat-value text-secondary">{currentClass?.students.length || 0}</div>
          </div>

          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-accent">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="stat-title">Outstanding Fees</div>
            <div className="stat-value text-accent">
              {currentClass?.students.filter(s => s.outstandingFees > 0).length || 0}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="card-title text-primary">Select Class</h3>
              <select 
                className="select select-bordered"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {classesData.map((classData) => (
                  <option key={classData.class} value={classData.class}>
                    {classData.class} ({classData.students.length} students)
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Admission #</th>
                    <th>Student Name</th>
                    <th>Outstanding Fees</th>
                    <th>Payment Status</th>
                    <th>Parent Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {currentClass?.students.map((student) => (
                    <tr key={student.id}>
                      <td className="font-mono">{student.admissionNumber}</td>
                      <td className="font-semibold">{student.name}</td>
                      <td>
                        <span className={`font-bold ${student.outstandingFees > 0 ? 'text-error' : 'text-success'}`}>
                          ₦{student.outstandingFees.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <div className={`badge ${student.outstandingFees > 0 ? 'badge-error' : 'badge-success'}`}>
                          {student.outstandingFees > 0 ? 'Outstanding' : 'Current'}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <p>{student.parentName}</p>
                          <p className="text-base-content/70">{student.parentPhone}</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAttendanceTab = () => {
    const currentClass = getCurrentClassData();
    
    return (
      <div className="space-y-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="card-title text-primary">Mark Attendance - {selectedClass}</h3>
              <div className="flex items-center gap-4">
                <input 
                  type="date"
                  className="input input-bordered"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                />
                <select 
                  className="select select-bordered"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  {classesData.map((classData) => (
                    <option key={classData.class} value={classData.class}>
                      {classData.class}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentClass?.students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="avatar placeholder">
                      <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                        <span className="text-xl">{student.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-sm text-base-content/70">{student.admissionNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={() => handleAttendanceSubmit(student.id, 'present')}
                    >
                      Present
                    </button>
                    <button 
                      className="btn btn-error btn-sm"
                      onClick={() => handleAttendanceSubmit(student.id, 'absent')}
                    >
                      Absent
                    </button>
                    <button 
                      className="btn btn-warning btn-sm"
                      onClick={() => handleAttendanceSubmit(student.id, 'late')}
                    >
                      Late
                    </button>
                    <button 
                      className="btn btn-info btn-sm"
                      onClick={() => handleAttendanceSubmit(student.id, 'excused')}
                    >
                      Excused
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGradesTab = () => {
    const currentClass = getCurrentClassData();
    
    return (
      <div className="space-y-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-primary mb-4">Record Grades - {selectedClass}</h3>
            
            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Student</span>
                  </label>
                  <select 
                    className="select select-bordered w-full"
                    value={gradeForm.studentId}
                    onChange={(e) => setGradeForm({...gradeForm, studentId: e.target.value})}
                    required
                  >
                    <option value="">Select a student</option>
                    {currentClass?.students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.admissionNumber})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="label">
                    <span className="label-text">Subject</span>
                  </label>
                  <input 
                    type="text"
                    className="input input-bordered w-full"
                    value={gradeForm.subject}
                    onChange={(e) => setGradeForm({...gradeForm, subject: e.target.value})}
                    placeholder="e.g., Mathematics, English"
                    required
                  />
                </div>
                
                <div>
                  <label className="label">
                    <span className="label-text">Assessment Type</span>
                  </label>
                  <select 
                    className="select select-bordered w-full"
                    value={gradeForm.assessment}
                    onChange={(e) => setGradeForm({...gradeForm, assessment: e.target.value})}
                  >
                    <option value="test">Test</option>
                    <option value="exam">Exam</option>
                    <option value="assignment">Assignment</option>
                    <option value="project">Project</option>
                  </select>
                </div>
                
                <div>
                  <label className="label">
                    <span className="label-text">Score</span>
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="number"
                      className="input input-bordered flex-1"
                      value={gradeForm.score}
                      onChange={(e) => setGradeForm({...gradeForm, score: e.target.value})}
                      placeholder="Score"
                      min="0"
                      required
                    />
                    <span className="flex items-center">out of</span>
                    <input 
                      type="number"
                      className="input input-bordered w-20"
                      value={gradeForm.maxScore}
                      onChange={(e) => setGradeForm({...gradeForm, maxScore: e.target.value})}
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">
                  Record Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderMessagesTab = () => (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-primary">Messages</h3>
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-base-content/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-base-content/60">Messaging system coming soon!</p>
            <p className="text-sm text-base-content/40">You'll be able to communicate with parents and administration here.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResourcesTab = () => (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-primary">Teaching Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-base-200">
              <div className="card-body">
                <h4 className="card-title text-secondary">Curriculum Guide</h4>
                <p>Access curriculum standards and lesson plans for {school.currentSession}.</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-secondary btn-sm">Download</button>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-200">
              <div className="card-body">
                <h4 className="card-title text-accent">Assessment Templates</h4>
                <p>Standardized test and exam templates for all subjects.</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-accent btn-sm">View Templates</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportsTab = () => {
    const currentClass = getCurrentClassData();
    
    return (
      <div className="space-y-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-primary">Class Reports - {selectedClass}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="stat bg-base-200 rounded">
                <div className="stat-title">Total Students</div>
                <div className="stat-value text-primary">{currentClass?.students.length || 0}</div>
              </div>
              <div className="stat bg-base-200 rounded">
                <div className="stat-title">Fee Defaulters</div>
                <div className="stat-value text-error">
                  {currentClass?.students.filter(s => s.outstandingFees > 0).length || 0}
                </div>
              </div>
              <div className="stat bg-base-200 rounded">
                <div className="stat-title">Current Students</div>
                <div className="stat-value text-success">
                  {currentClass?.students.filter(s => s.outstandingFees === 0).length || 0}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <button className="btn btn-outline">Generate Attendance Report</button>
              <button className="btn btn-outline">Generate Grade Report</button>
              <button className="btn btn-outline">Generate Fee Status Report</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <span className="btn btn-ghost text-xl font-bold">
            {school?.name} - Teacher Portal
          </span>
        </div>
        <div className="flex-none">
          <span className="mr-4 text-sm">Welcome, {currentUser?.name}!</span>
          <button className="btn btn-outline" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 pt-6">
        <div className="tabs tabs-boxed bg-base-100 shadow-lg mb-6">
          <button 
            className={`tab ${activeTab === 'classes' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('classes')}
          >
            My Classes
          </button>
          <button 
            className={`tab ${activeTab === 'attendance' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
          <button 
            className={`tab ${activeTab === 'grades' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('grades')}
          >
            Grades
          </button>
          <button 
            className={`tab ${activeTab === 'messages' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
          <button 
            className={`tab ${activeTab === 'resources' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </button>
          <button 
            className={`tab ${activeTab === 'reports' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>

        {/* Tab Content */}
        <div className="pb-8">
          {activeTab === 'classes' && renderClassesTab()}
          {activeTab === 'attendance' && renderAttendanceTab()}
          {activeTab === 'grades' && renderGradesTab()}
          {activeTab === 'messages' && renderMessagesTab()}
          {activeTab === 'resources' && renderResourcesTab()}
          {activeTab === 'reports' && renderReportsTab()}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;