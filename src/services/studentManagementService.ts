// School Admin Student Management Service - Parent Assignment and Siblings Management
import { getSupabase } from '../supabaseClient';
import { Student, CurrentUser } from '../types';

// Persistent offline storage using localStorage
const PARENT_ACCOUNTS_KEY = 'schoolfees_parent_accounts';
const STUDENT_ASSIGNMENTS_KEY = 'schoolfees_student_assignments';

// Initialize with persistent localStorage data
const initializeOfflineData = () => {
  // Load existing data from localStorage or use default seed data
  const existingParents = localStorage.getItem(PARENT_ACCOUNTS_KEY);
  const existingAssignments = localStorage.getItem(STUDENT_ASSIGNMENTS_KEY);
  
  if (!existingParents) {
    // Initialize with seed data only if no existing data
    const seedParents: ParentAccount[] = [
      {
        id: 'parent_1',
        email: 'adebayo.johnson@email.com',
        name: 'Adebayo Johnson',
        phone: '+2348012345678',
        childrenIds: ['stu_sunnydale_123_1', 'stu_sunnydale_123_2'],
        schoolId: 'sch_sunnydale_123',
        createdAt: '2023-09-01T00:00:00Z',
        updatedAt: '2023-09-01T00:00:00Z'
      },
      {
        id: 'parent_2',
        email: 'chioma.okafor@email.com',
        name: 'Chioma Okafor',
        phone: '+2348087654321',
        childrenIds: ['stu_sunnydale_123_3'],
        schoolId: 'sch_sunnydale_123',
        createdAt: '2023-09-15T00:00:00Z',
        updatedAt: '2023-09-15T00:00:00Z'
      }
    ];
    localStorage.setItem(PARENT_ACCOUNTS_KEY, JSON.stringify(seedParents));
  }
  
  if (!existingAssignments) {
    // Initialize with empty assignments
    localStorage.setItem(STUDENT_ASSIGNMENTS_KEY, JSON.stringify([]));
  }
};

// Helper functions for persistent storage
const getStoredParentAccounts = (): ParentAccount[] => {
  try {
    const stored = localStorage.getItem(PARENT_ACCOUNTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to load parent accounts from localStorage:', error);
    return [];
  }
};

const saveParentAccounts = (accounts: ParentAccount[]): void => {
  try {
    localStorage.setItem(PARENT_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (error) {
    console.warn('Failed to save parent accounts to localStorage:', error);
  }
};

const getStoredAssignments = (): StudentParentAssignment[] => {
  try {
    const stored = localStorage.getItem(STUDENT_ASSIGNMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to load assignments from localStorage:', error);
    return [];
  }
};

const saveAssignments = (assignments: StudentParentAssignment[]): void => {
  try {
    localStorage.setItem(STUDENT_ASSIGNMENTS_KEY, JSON.stringify(assignments));
  } catch (error) {
    console.warn('Failed to save assignments to localStorage:', error);
  }
};

export interface ParentAccount {
  id: string;
  email: string;
  name: string;
  phone: string;
  childrenIds: string[];
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyGroup {
  parentId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  children: Student[];
  totalOutstandingFees: number;
  familyDiscountEligible: boolean;
}

export interface StudentParentAssignment {
  studentId: string;
  parentId: string;
  relationshipType: 'father' | 'mother' | 'guardian' | 'other';
  isPrimary: boolean;
  assignedAt: string;
  assignedBy: string;
}

class StudentManagementService {
  // Parent Account Management
  async getParentAccounts(schoolId: string): Promise<ParentAccount[]> {
    const supabase = getSupabase();
    
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('parent_accounts')
          .select('*')
          .eq('schoolId', schoolId)
          .order('name');
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.warn('Failed to load parent accounts:', error);
      }
    }

    // Initialize persistent storage if needed
    initializeOfflineData();
    
    // Return parent accounts for the specific school from localStorage
    const allParents = getStoredParentAccounts();
    return allParents.filter(parent => parent.schoolId === schoolId);
  }

  async createParentAccount(schoolId: string, parentData: {
    email: string;
    name: string;
    phone: string;
  }): Promise<ParentAccount> {
    const newParent: ParentAccount = {
      id: Date.now().toString(),
      ...parentData,
      childrenIds: [],
      schoolId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('parent_accounts')
          .insert([newParent])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to create parent account:', error);
        throw new Error('Failed to create parent account in database');
      }
    }

    // Store in persistent localStorage
    initializeOfflineData();
    const allParents = getStoredParentAccounts();
    allParents.push(newParent);
    saveParentAccounts(allParents);
    console.log('Created parent account in offline mode:', newParent);
    
    return newParent;
  }

  async updateParentAccount(parentId: string, updates: Partial<ParentAccount>): Promise<ParentAccount | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('parent_accounts')
          .update({ ...updates, updatedAt: new Date().toISOString() })
          .eq('id', parentId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to update parent account:', error);
      }
    }

    return null;
  }

  // Student-Parent Assignment
  async assignStudentToParent(
    studentId: string, 
    parentId: string, 
    relationshipType: 'father' | 'mother' | 'guardian' | 'other' = 'guardian',
    assignedBy: string
  ): Promise<boolean> {
    const assignment: StudentParentAssignment = {
      studentId,
      parentId,
      relationshipType,
      isPrimary: true,
      assignedAt: new Date().toISOString(),
      assignedBy
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        // Create assignment record
        const { error: assignmentError } = await supabase
          .from('student_parent_assignments')
          .insert([assignment]);

        if (assignmentError) throw assignmentError;

        // Update parent's childrenIds
        const { data: parent, error: parentFetchError } = await supabase
          .from('parent_accounts')
          .select('childrenIds')
          .eq('id', parentId)
          .single();

        if (parentFetchError) throw parentFetchError;

        const updatedChildrenIds = [...(parent.childrenIds || []), studentId];
        
        const { error: parentUpdateError } = await supabase
          .from('parent_accounts')
          .update({ 
            childrenIds: updatedChildrenIds,
            updatedAt: new Date().toISOString()
          })
          .eq('id', parentId);

        if (parentUpdateError) throw parentUpdateError;

        return true;
      } catch (error) {
        console.warn('Failed to assign student to parent:', error);
        throw new Error('Failed to assign student to parent in database');
      }
    }

    // Handle offline assignment with persistent storage
    initializeOfflineData();
    
    // Store the assignment
    const allAssignments = getStoredAssignments();
    allAssignments.push(assignment);
    saveAssignments(allAssignments);
    
    // Update parent's childrenIds
    const allParents = getStoredParentAccounts();
    const parentIndex = allParents.findIndex(p => p.id === parentId);
    if (parentIndex === -1) {
      throw new Error('Parent not found');
    }
    
    const parent = allParents[parentIndex];
    if (!parent.childrenIds.includes(studentId)) {
      parent.childrenIds.push(studentId);
      parent.updatedAt = new Date().toISOString();
      allParents[parentIndex] = parent;
      saveParentAccounts(allParents);
    }
    
    console.log('Assigned student to parent in offline mode:', { studentId, parentId, parent: parent.name });
    return true;
  }

  async unassignStudentFromParent(studentId: string, parentId: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        // Remove assignment record
        const { error: assignmentError } = await supabase
          .from('student_parent_assignments')
          .delete()
          .eq('studentId', studentId)
          .eq('parentId', parentId);

        if (assignmentError) throw assignmentError;

        // Update parent's childrenIds
        const { data: parent, error: parentFetchError } = await supabase
          .from('parent_accounts')
          .select('childrenIds')
          .eq('id', parentId)
          .single();

        if (parentFetchError) throw parentFetchError;

        const updatedChildrenIds = (parent.childrenIds || []).filter(id => id !== studentId);
        
        const { error: parentUpdateError } = await supabase
          .from('parent_accounts')
          .update({ 
            childrenIds: updatedChildrenIds,
            updatedAt: new Date().toISOString()
          })
          .eq('id', parentId);

        if (parentUpdateError) throw parentUpdateError;

        return true;
      } catch (error) {
        console.warn('Failed to unassign student from parent:', error);
        throw new Error('Failed to unassign student from parent in database');
      }
    }

    // Handle offline unassignment with persistent storage
    initializeOfflineData();
    
    // Remove the assignment
    const allAssignments = getStoredAssignments();
    const updatedAssignments = allAssignments.filter(
      assignment => !(assignment.studentId === studentId && assignment.parentId === parentId)
    );
    saveAssignments(updatedAssignments);
    
    // Update parent's childrenIds
    const allParents = getStoredParentAccounts();
    const parentIndex = allParents.findIndex(p => p.id === parentId);
    if (parentIndex !== -1) {
      const parent = allParents[parentIndex];
      parent.childrenIds = parent.childrenIds.filter(id => id !== studentId);
      parent.updatedAt = new Date().toISOString();
      allParents[parentIndex] = parent;
      saveParentAccounts(allParents);
      
      console.log('Unassigned student from parent in offline mode:', { studentId, parentId, parent: parent.name });
    }
    
    return true;
  }

  // Siblings Management
  async getFamilyGroups(schoolId: string, students: Student[]): Promise<FamilyGroup[]> {
    const parentAccounts = await this.getParentAccounts(schoolId);
    
    const familyGroups: FamilyGroup[] = parentAccounts.map(parent => {
      const children = students.filter(student => 
        parent.childrenIds.includes(student.id)
      );

      const totalOutstandingFees = children.reduce(
        (sum, child) => sum + child.outstandingFees, 0
      );

      // Family discount eligibility: 2+ children with total fees > 100,000
      const familyDiscountEligible = children.length >= 2 && totalOutstandingFees > 100000;

      return {
        parentId: parent.id,
        parentName: parent.name,
        parentEmail: parent.email,
        parentPhone: parent.phone,
        children,
        totalOutstandingFees,
        familyDiscountEligible
      };
    }).filter(family => family.children.length > 0); // Only families with children

    return familyGroups.sort((a, b) => b.children.length - a.children.length);
  }

  async applySiblingDiscount(
    parentId: string, 
    discountPercentage: number,
    appliedBy: string
  ): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        // Get all children of this parent
        const { data: parent, error: parentError } = await supabase
          .from('parent_accounts')
          .select('childrenIds')
          .eq('id', parentId)
          .single();

        if (parentError) throw parentError;

        // Apply discount to each child's fees
        for (const studentId of parent.childrenIds) {
          const { data: student, error: studentError } = await supabase
            .from('students')
            .select('*')
            .eq('id', studentId)
            .single();

          if (studentError) continue;

          // Calculate discounted fees
          const discountAmount = (student.outstandingFees * discountPercentage) / 100;
          const newOutstandingFees = student.outstandingFees - discountAmount;

          // Update student record
          await supabase
            .from('students')
            .update({
              outstandingFees: newOutstandingFees,
              updatedAt: new Date().toISOString()
            })
            .eq('id', studentId);

          // Record discount transaction
          await supabase
            .from('fee_payment_transactions')
            .insert([{
              id: Date.now().toString() + '_' + studentId,
              studentId,
              amount: discountAmount,
              paymentMethod: 'sibling_discount',
              status: 'completed',
              processedBy: appliedBy,
              notes: `Sibling discount applied: ${discountPercentage}%`,
              createdAt: new Date().toISOString()
            }]);
        }

        return true;
      } catch (error) {
        console.warn('Failed to apply sibling discount:', error);
      }
    }

    return false;
  }

  // Bulk Operations for Siblings
  async bulkUpdateSiblings(
    parentId: string, 
    updates: {
      newClass?: string;
      newSession?: string;
      newTerm?: string;
      addFees?: { type: string; amount: number; dueDate: string }[];
    },
    updatedBy: string
  ): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: parent, error: parentError } = await supabase
          .from('parent_accounts')
          .select('childrenIds')
          .eq('id', parentId)
          .single();

        if (parentError) throw parentError;

        for (const studentId of parent.childrenIds) {
          const updateData: any = {
            updatedAt: new Date().toISOString()
          };

          if (updates.newClass) updateData.class = updates.newClass;
          if (updates.newSession) updateData.session = updates.newSession;
          if (updates.newTerm) updateData.term = updates.newTerm;

          // Add new fees if specified
          if (updates.addFees && updates.addFees.length > 0) {
            const { data: student, error: studentError } = await supabase
              .from('students')
              .select('fees, outstandingFees')
              .eq('id', studentId)
              .single();

            if (!studentError && student) {
              const newFees = updates.addFees.map(fee => ({
                id: `fee_${Date.now()}_${studentId}`,
                ...fee,
                paidAmount: 0,
                status: 'pending'
              }));

              const totalNewFees = updates.addFees.reduce((sum, fee) => sum + fee.amount, 0);

              updateData.fees = [...(student.fees || []), ...newFees];
              updateData.outstandingFees = student.outstandingFees + totalNewFees;
            }
          }

          await supabase
            .from('students')
            .update(updateData)
            .eq('id', studentId);
        }

        return true;
      } catch (error) {
        console.warn('Failed to bulk update siblings:', error);
      }
    }

    return false;
  }

  // No longer needed - using proper offline storage above
}

export const studentManagementService = new StudentManagementService();