// School Admin Student Management - Parent Assignment and Siblings Management
import React, { useState, useEffect } from 'react';
import { Student, School } from '../types';
import { studentManagementService, ParentAccount, FamilyGroup } from '../services/studentManagementService';
import { getSchools } from '../services/dataService';

interface StudentsViewProps {
  school: School;
  refreshData: () => void;
}

const StudentsView: React.FC<StudentsViewProps> = ({ school, refreshData }) => {
  const [activeTab, setActiveTab] = useState<'students' | 'families' | 'assignments'>('students');
  const [students, setStudents] = useState<Student[]>([]);
  const [parentAccounts, setParentAccounts] = useState<ParentAccount[]>([]);
  const [familyGroups, setFamilyGroups] = useState<FamilyGroup[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showCreateParent, setShowCreateParent] = useState(false);
  const [showAssignStudent, setShowAssignStudent] = useState(false);
  const [showBulkOperations, setShowBulkOperations] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<FamilyGroup | null>(null);
  
  // Form states
  const [newParent, setNewParent] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [assignment, setAssignment] = useState({
    studentId: '',
    parentId: '',
    relationshipType: 'guardian' as 'father' | 'mother' | 'guardian' | 'other'
  });

  const [bulkUpdate, setBulkUpdate] = useState({
    parentId: '',
    newClass: '',
    newSession: '',
    newTerm: '',
    addFees: [] as { type: string; amount: number; dueDate: string }[]
  });

  const [siblingDiscount, setSiblingDiscount] = useState({
    parentId: '',
    discountPercentage: 10
  });

  useEffect(() => {
    loadData();
  }, [school.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [schools, parents] = await Promise.all([
        getSchools(),
        studentManagementService.getParentAccounts(school.id)
      ]);

      const currentSchool = schools.find(s => s.id === school.id);
      const schoolStudents = currentSchool ? currentSchool.students : [];

      setStudents(schoolStudents);
      setParentAccounts(parents);

      const families = await studentManagementService.getFamilyGroups(school.id, schoolStudents);
      setFamilyGroups(families);
    } catch (error) {
      console.error('Failed to load student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateParent = async () => {
    if (!newParent.name || !newParent.email || !newParent.phone) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const createdParent = await studentManagementService.createParentAccount(school.id, newParent);
      console.log('Successfully created parent account:', createdParent);
      await loadData();
      setShowCreateParent(false);
      setNewParent({ name: '', email: '', phone: '' });
      alert(`Successfully created parent account for ${createdParent.name}`);
    } catch (error) {
      console.error('Failed to create parent account:', error);
      alert(`Failed to create parent account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleAssignStudent = async () => {
    if (!assignment.studentId || !assignment.parentId) {
      alert('Please select both student and parent');
      return;
    }

    try {
      const student = students.find(s => s.id === assignment.studentId);
      const parent = parentAccounts.find(p => p.id === assignment.parentId);
      
      const success = await studentManagementService.assignStudentToParent(
        assignment.studentId,
        assignment.parentId,
        assignment.relationshipType,
        'school_admin' // In real implementation, use current user ID
      );
      
      if (success) {
        console.log('Successfully assigned student to parent');
        await loadData();
        setShowAssignStudent(false);
        setAssignment({ studentId: '', parentId: '', relationshipType: 'guardian' });
        alert(`Successfully assigned ${student?.name} to ${parent?.name}`);
      } else {
        throw new Error('Assignment failed');
      }
    } catch (error) {
      console.error('Failed to assign student to parent:', error);
      alert(`Failed to assign student to parent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUnassignStudent = async (studentId: string, parentId: string) => {
    const student = students.find(s => s.id === studentId);
    const parent = parentAccounts.find(p => p.id === parentId);
    
    if (confirm(`Are you sure you want to unassign ${student?.name} from ${parent?.name}?`)) {
      try {
        const success = await studentManagementService.unassignStudentFromParent(studentId, parentId);
        if (success) {
          console.log('Successfully unassigned student from parent');
          await loadData();
          alert(`Successfully unassigned ${student?.name} from ${parent?.name}`);
        } else {
          throw new Error('Unassignment failed');
        }
      } catch (error) {
        console.error('Failed to unassign student:', error);
        alert(`Failed to unassign student: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleApplySiblingDiscount = async () => {
    if (!siblingDiscount.parentId || siblingDiscount.discountPercentage <= 0) {
      alert('Please select a family and enter a valid discount percentage');
      return;
    }

    try {
      await studentManagementService.applySiblingDiscount(
        siblingDiscount.parentId,
        siblingDiscount.discountPercentage,
        'school_admin' // In real implementation, use current user ID
      );
      await loadData();
      setSiblingDiscount({ parentId: '', discountPercentage: 10 });
      alert('Sibling discount applied successfully!');
    } catch (error) {
      console.error('Failed to apply sibling discount:', error);
      alert('Failed to apply sibling discount');
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkUpdate.parentId) {
      alert('Please select a family');
      return;
    }

    try {
      await studentManagementService.bulkUpdateSiblings(
        bulkUpdate.parentId,
        {
          newClass: bulkUpdate.newClass || undefined,
          newSession: bulkUpdate.newSession || undefined,
          newTerm: bulkUpdate.newTerm || undefined,
          addFees: bulkUpdate.addFees.length > 0 ? bulkUpdate.addFees : undefined
        },
        'school_admin' // In real implementation, use current user ID
      );
      await loadData();
      setShowBulkOperations(false);
      setBulkUpdate({ parentId: '', newClass: '', newSession: '', newTerm: '', addFees: [] });
      alert('Bulk update completed successfully!');
    } catch (error) {
      console.error('Failed to perform bulk update:', error);
      alert('Failed to perform bulk update');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getUnassignedStudents = () => {
    const assignedStudentIds = parentAccounts.flatMap(parent => parent.childrenIds);
    return students.filter(student => !assignedStudentIds.includes(student.id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-base-content/60">Manage students, parents, and family relationships</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateParent(true)}
            className="btn btn-primary btn-sm"
          >
            Create Parent Account
          </button>
          <button
            onClick={() => setShowAssignStudent(true)}
            className="btn btn-secondary btn-sm"
          >
            Assign Student
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="stat">
              <div className="stat-title">Total Students</div>
              <div className="stat-value text-primary">{students.length}</div>
              <div className="stat-desc">
                Unassigned: {getUnassignedStudents().length}
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="stat">
              <div className="stat-title">Parent Accounts</div>
              <div className="stat-value text-secondary">{parentAccounts.length}</div>
              <div className="stat-desc">
                Active families
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="stat">
              <div className="stat-title">Families</div>
              <div className="stat-value text-accent">{familyGroups.length}</div>
              <div className="stat-desc">
                With siblings: {familyGroups.filter(f => f.children.length > 1).length}
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="stat">
              <div className="stat-title">Discount Eligible</div>
              <div className="stat-value text-warning">
                {familyGroups.filter(f => f.familyDiscountEligible).length}
              </div>
              <div className="stat-desc">
                Large families
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed">
        <button
          className={`tab ${activeTab === 'students' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          All Students
        </button>
        <button
          className={`tab ${activeTab === 'families' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('families')}
        >
          Family Groups
        </button>
        <button
          className={`tab ${activeTab === 'assignments' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          Assign & Manage
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'students' && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">All Students</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Admission No.</th>
                    <th>Class</th>
                    <th>Parent Info</th>
                    <th>Outstanding Fees</th>
                    <th>Assignment Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const assignedParent = parentAccounts.find(parent => 
                      parent.childrenIds.includes(student.id)
                    );
                    return (
                      <tr key={student.id}>
                        <td>
                          <div className="font-semibold">{student.name}</div>
                          <div className="text-sm text-base-content/60">{student.dateOfBirth}</div>
                        </td>
                        <td>{student.admissionNumber}</td>
                        <td>{student.class}</td>
                        <td>
                          {assignedParent ? (
                            <div>
                              <div className="font-semibold">{assignedParent.name}</div>
                              <div className="text-sm text-base-content/60">{assignedParent.email}</div>
                              <div className="text-sm text-base-content/60">{assignedParent.phone}</div>
                            </div>
                          ) : (
                            <div>
                              <div className="font-semibold">{student.parentName}</div>
                              <div className="text-sm text-base-content/60">{student.parentEmail}</div>
                              <div className="text-sm text-base-content/60">{student.parentPhone}</div>
                            </div>
                          )}
                        </td>
                        <td>{formatCurrency(student.outstandingFees)}</td>
                        <td>
                          {assignedParent ? (
                            <span className="badge badge-success">Assigned</span>
                          ) : (
                            <span className="badge badge-warning">Unassigned</span>
                          )}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            {assignedParent && (
                              <button
                                className="btn btn-sm btn-error btn-outline"
                                onClick={() => handleUnassignStudent(student.id, assignedParent.id)}
                              >
                                Unassign
                              </button>
                            )}
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => {
                                setSelectedStudent(student);
                                setAssignment({ ...assignment, studentId: student.id });
                                setShowAssignStudent(true);
                              }}
                            >
                              Assign
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'families' && (
        <div className="space-y-6">
          {familyGroups.map((family) => (
            <div key={family.parentId} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="card-title">{family.parentName} Family</h3>
                    <p className="text-base-content/60">{family.parentEmail} • {family.parentPhone}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="badge badge-info">{family.children.length} Children</span>
                      {family.familyDiscountEligible && (
                        <span className="badge badge-success">Discount Eligible</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {formatCurrency(family.totalOutstandingFees)}
                    </div>
                    <div className="text-sm text-base-content/60">Total Outstanding</div>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {family.children.map((child) => (
                    <div key={child.id} className="card bg-base-200">
                      <div className="card-body compact">
                        <h4 className="font-semibold">{child.name}</h4>
                        <p className="text-sm">{child.class} • {child.admissionNumber}</p>
                        <p className="text-sm font-semibold">
                          {formatCurrency(child.outstandingFees)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card-actions justify-end mt-4">
                  {family.familyDiscountEligible && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => {
                        setSiblingDiscount({ ...siblingDiscount, parentId: family.parentId });
                        // Open discount modal
                      }}
                    >
                      Apply Sibling Discount
                    </button>
                  )}
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setSelectedFamily(family);
                      setBulkUpdate({ ...bulkUpdate, parentId: family.parentId });
                      setShowBulkOperations(true);
                    }}
                  >
                    Bulk Operations
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Unassigned Students */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">Unassigned Students</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {getUnassignedStudents().map((student) => (
                  <div key={student.id} className="flex justify-between items-center p-3 bg-base-200 rounded">
                    <div>
                      <div className="font-semibold">{student.name}</div>
                      <div className="text-sm text-base-content/60">{student.class} • {student.admissionNumber}</div>
                    </div>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setAssignment({ ...assignment, studentId: student.id });
                        setShowAssignStudent(true);
                      }}
                    >
                      Assign
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">Quick Actions</h3>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Apply Sibling Discount</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      className="select select-bordered flex-1"
                      value={siblingDiscount.parentId}
                      onChange={(e) => setSiblingDiscount({ ...siblingDiscount, parentId: e.target.value })}
                    >
                      <option value="">Select Family</option>
                      {familyGroups
                        .filter(f => f.familyDiscountEligible)
                        .map((family) => (
                          <option key={family.parentId} value={family.parentId}>
                            {family.parentName} ({family.children.length} children)
                          </option>
                        ))}
                    </select>
                    <input
                      type="number"
                      className="input input-bordered w-20"
                      value={siblingDiscount.discountPercentage}
                      onChange={(e) => setSiblingDiscount({ ...siblingDiscount, discountPercentage: Number(e.target.value) })}
                      min="1"
                      max="50"
                    />
                    <span className="self-center">%</span>
                  </div>
                  <button
                    className="btn btn-success btn-sm mt-2"
                    onClick={handleApplySiblingDiscount}
                    disabled={!siblingDiscount.parentId}
                  >
                    Apply Discount
                  </button>
                </div>

                <div className="divider"></div>

                <div className="stats stats-vertical shadow">
                  <div className="stat">
                    <div className="stat-title">Large Families</div>
                    <div className="stat-value text-primary">
                      {familyGroups.filter(f => f.children.length >= 3).length}
                    </div>
                    <div className="stat-desc">3+ children</div>
                  </div>
                  
                  <div className="stat">
                    <div className="stat-title">Discount Eligible</div>
                    <div className="stat-value text-success">
                      {familyGroups.filter(f => f.familyDiscountEligible).length}
                    </div>
                    <div className="stat-desc">Can get family discount</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Parent Modal */}
      {showCreateParent && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create Parent Account</h3>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={newParent.name}
                  onChange={(e) => setNewParent({ ...newParent, name: e.target.value })}
                  placeholder="Enter parent's full name"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email Address</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered"
                  value={newParent.email}
                  onChange={(e) => setNewParent({ ...newParent, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input
                  type="tel"
                  className="input input-bordered"
                  value={newParent.phone}
                  onChange={(e) => setNewParent({ ...newParent, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setShowCreateParent(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateParent}>
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Student Modal */}
      {showAssignStudent && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Assign Student to Parent</h3>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Student</span>
                </label>
                <select
                  className="select select-bordered"
                  value={assignment.studentId}
                  onChange={(e) => setAssignment({ ...assignment, studentId: e.target.value })}
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.class} ({student.admissionNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Parent Account</span>
                </label>
                <select
                  className="select select-bordered"
                  value={assignment.parentId}
                  onChange={(e) => setAssignment({ ...assignment, parentId: e.target.value })}
                >
                  <option value="">Select Parent</option>
                  {parentAccounts.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name} - {parent.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Relationship</span>
                </label>
                <select
                  className="select select-bordered"
                  value={assignment.relationshipType}
                  onChange={(e) => setAssignment({ ...assignment, relationshipType: e.target.value as any })}
                >
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="guardian">Guardian</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setShowAssignStudent(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAssignStudent}>
                Assign Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Operations Modal */}
      {showBulkOperations && selectedFamily && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">
              Bulk Operations for {selectedFamily.parentName} Family
            </h3>
            <p className="text-base-content/60 mb-4">
              This will apply changes to all {selectedFamily.children.length} children
            </p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">New Class (Optional)</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={bulkUpdate.newClass}
                    onChange={(e) => setBulkUpdate({ ...bulkUpdate, newClass: e.target.value })}
                    placeholder="e.g., Primary 2"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">New Session (Optional)</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={bulkUpdate.newSession}
                    onChange={(e) => setBulkUpdate({ ...bulkUpdate, newSession: e.target.value })}
                    placeholder="e.g., 2023/2024"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">New Term (Optional)</span>
                </label>
                <select
                  className="select select-bordered"
                  value={bulkUpdate.newTerm}
                  onChange={(e) => setBulkUpdate({ ...bulkUpdate, newTerm: e.target.value })}
                >
                  <option value="">No change</option>
                  <option value="First Term">First Term</option>
                  <option value="Second Term">Second Term</option>
                  <option value="Third Term">Third Term</option>
                </select>
              </div>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setShowBulkOperations(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleBulkUpdate}>
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsView;