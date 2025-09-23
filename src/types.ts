// Core Types for School Management System

export interface School {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  contactPhone?: string;
  logo?: string;
  slug: string;
  currentSession: string;
  currentTerm: string;
  planId: string;
  subscriptionEndDate?: string;
  students: Student[];
  staff: Staff[];
  teamMembers: TeamMember[];
  applicants: Applicant[];
  feeDefinitions: FeeDefinition[];
  settings?: SchoolSettings;
  smsSettings?: SMSSettings;
  communicationSettings?: CommunicationSettings;
  otherIncome: Income[];
  expenditures: Expenditure[];
  adminUser?: {name: string; email: string};
  cancellationPending?: boolean;
  landingPageContent?: any;
  paymentSettings?: any;
  payrollSettings?: PayrollSettings;
  pendingPlanId?: string | null;
  created_at?: string;
}

export interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  class: string;
  dateOfBirth: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  fees: Fee[];
  outstandingFees: number;
  debtRisk: RiskLevel;
  status: 'active' | 'inactive' | 'graduated';
  payments: Payment[];
  amountPaid?: number;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'teacher' | 'admin' | 'bursar' | 'accountant';
  salary: number;
  dateHired: string;
  status: 'active' | 'inactive';
}

export interface Fee {
  id: string;
  type: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  session: string;
  term: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface FeeDefinition {
  id: string;
  name: string;
  category: string;
  amounts: FeeAmount[];
  isRecurring: boolean;
  description?: string;
}

export interface FeeAmount {
  class: string;
  amount: number;
  type: 'mandatory' | 'optional';
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  applyingForClass: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  status: ApplicationStatus;
  applicationDate: string;
  documents?: string[];
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: 'parent' | 'teacher' | 'staff' | 'schoolAdmin' | 'superAdmin';
  schoolId?: string;
  avatar?: string;
  childrenIds?: string[];
  assignedClasses?: string[];
  userRole?: UserRole;
}

export interface PlatformConfig {
  id: string;
  websiteContent: WebsiteContent;
  pricingPlans: PricingPlan[];
  knowledgeBaseArticles: KnowledgeBaseArticle[];
  supportConfig: SupportConfig;
}

export interface WebsiteContent {
  title: string;
  tagline: string;
  description: string;
  features: Feature[];
  testimonials: {
    title: string;
    items: Testimonial[];
  };
  theme: string;
  logo?: string;
  contactInfo: ContactInfo;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  icon?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  quote: string;
  avatar?: string;
  school?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  prices: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  isPopular?: boolean;
  limits: {
    students: number;
    staff: number;
    storage: string;
  };
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  whatsapp?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface SupportConfig {
  email: string;
  phone: string;
  chatEnabled: boolean;
  ticketingEnabled: boolean;
  knowledgeBaseEnabled: boolean;
}

export interface SchoolSettings {
  currency: string;
  academicYear: string;
  terms: string[];
  gradeSystem: string;
  paymentMethods: string[];
  notifications: NotificationSettings;
}

export interface SMSSettings {
  enabledGateway?: string | null;
  gatewayCredentials?: any;
  reminderTemplate?: string;
  manualTemplates?: SMSTemplate[];
}

export interface CommunicationSettings {
  emailProvider?: string;
  smtpSettings?: any;
  whatsappProvider?: string;
  whatsappApiSettings?: any;
  automatedReminders?: {
    enabled: boolean;
    daysAfterDueDate: number;
  };
  manualTemplates: CommunicationTemplate[];
  transactionalNotifications?: TransactionalNotifications;
}

export interface TransactionalNotifications {
  paymentConfirmation?: {
    enabled?: boolean;
    emailSubject: string;
    emailTemplate: string;
    smsTemplate?: string;
    whatsappTemplate?: string;
  };
}

export interface SMSTemplate {
  id: string;
  name: string;
  type: 'reminder' | 'receipt' | 'general';
  body: string;
}

export interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'reminder' | 'receipt' | 'general';
  subject: string;
  body: string;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  reminderDays: number[];
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  imageUrl?: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  reference?: string;
  status: 'pending' | 'completed' | 'failed';
}

// Enums
export enum RiskLevel {
  Low = 'low',
  Medium = 'medium',
  High = 'high'
}

export enum ApplicationStatus {
  Pending = 'pending',
  Applied = 'applied',
  AwaitingTest = 'awaiting_test',
  Reviewed = 'reviewed',
  Accepted = 'accepted',
  OfferedAdmission = 'offered_admission',
  Rejected = 'rejected',
  AdmissionDeclined = 'admission_declined',
  Enrolled = 'enrolled'
}

export enum PaymentStatus {
  Pending = 'pending',
  Paid = 'paid',
  Overdue = 'overdue',
  Partial = 'partial'
}

export enum Term {
  First = 'first',
  Second = 'second', 
  Third = 'third'
}

export enum UserRole {
  Administrator = 'administrator',
  Teacher = 'teacher',
  Student = 'student',
  Parent = 'parent'
}

// View types for navigation
export type View = 
  | 'Dashboard'
  | 'Students'
  | 'Team'
  | 'Staff'
  | 'Reports'
  | 'Communication'
  | 'Printing'
  | 'Settings'
  | 'AI Insights'
  | 'Admissions'
  | 'Knowledge Base'
  | 'Bursary'
  | 'Student Payments'
  | 'Invoices & Receipts'
  | 'Other Income'
  | 'Expenditures'
  | 'Payroll'
  | 'Reconciliation'
  | 'Fee Structure'
  | 'More';

// Bursary sub-view types
export type BursarySubView = 
  | 'Student Payments'
  | 'Invoices & Receipts'
  | 'Other Income'
  | 'Expenditures'
  | 'Payroll'
  | 'Reconciliation'
  | 'Fee Structure';

// Payment interface for student payments
export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  description: string;
  method: 'cash' | 'bank_transfer' | 'card' | 'online' | 'cheque';
  status: 'pending' | 'completed' | 'failed' | 'Pending Verification';
  reference?: string;
  proofOfPaymentUrl?: string;
  feeAllocations?: PaymentAllocation[];
}

// Payment allocation interface
export interface PaymentAllocation {
  feeId: string;
  amount: number;
  feeType: string;
}

// Income interface for other school income
export interface Income extends Transaction {
  type: 'income';
  source: string;
}

// Expenditure interface for school expenses
export interface Expenditure extends Transaction {
  type: 'expense';
  vendor?: string;
  approvedBy?: string;
}

// Salary information interface
export interface SalaryInfo {
  baseSalary: number;
  allowances: Allowance[];
  deductions: Deduction[];
  payslips: Payslip[];
}

// Team member interface (alias for Staff with additional properties)
export interface TeamMember extends Staff {
  department?: string;
  permissions?: string[];
  salaryInfo?: SalaryInfo;
  assignedClasses?: string[];
}

// Payroll related interfaces
export interface PayrollSettings {
  payrollCycle: 'monthly' | 'bi-weekly' | 'weekly';
  defaultDeductions: Deduction[];
  employeePensionRate: number;
  payeBrackets: Array<{upTo: number; rate: number}>;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
}

export interface Payslip {
  id: string;
  staffId: string;
  teamMemberId?: string;
  period: string;
  year: number;
  month: number;
  basicSalary: number;
  allowances: Allowance[];
  deductions: Deduction[];
  grossPay: number;
  netPay: number;
  status: 'draft' | 'sent' | 'paid';
  generatedAt: string;
}

export interface Allowance {
  id: string;
  name: string;
  amount: number;
  type: 'fixed' | 'percentage';
}

export interface Deduction {
  id: string;
  name: string;
  amount: number;
  type: 'fixed' | 'percentage';
  mandatory: boolean;
}

export interface Discount {
  id: string;
  name: string;
  type: 'fixed' | 'percentage';
  value: number;
  applicableClasses: string[];
  validFrom: string;
  validTo: string;
  maxUsage?: number;
  currentUsage: number;
}

// School registration data interface
export interface NewSchoolRegistrationData {
  username: string;
  schoolName: string;
  schoolEmail: string;
  schoolAddress: string;
  schoolPhone: string;
  adminName: string;
  adminEmail: string;
}

// Export statement removed - using individual exports instead