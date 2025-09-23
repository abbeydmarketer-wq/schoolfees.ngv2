import { PlatformConfig, School, RiskLevel, Term, ApplicationStatus, UserRole } from '../types';

export const mockSchools: School[] = [
    {
        id: 'sch_sunnydale_123',
        slug: 'sunnydale',
        name: 'Sunnydale High School',
        address: '123, Education Avenue, Lagos',
        email: 'admin@sunnydale.com',
        phone: '08012345678',
        logo: 'https://placehold.co/100x100/2563EB/FFFFFF/png?text=SHS',
        students: [
            {
                id: 'stu_sunnydale_123_1', name: 'Tunde Okoro', admissionNumber: 'SHS001', class: 'JSS1', dateOfBirth: '2012-05-15',
                parentName: 'Mr. Okoro', parentEmail: 'parent@sunnydale.com', parentPhone: '08098765432', address: 'Lagos, Nigeria',
                outstandingFees: 0, debtRisk: RiskLevel.Low, status: 'active',
                fees: [
                    { id: 'fee1_1', type: 'Tuition', amount: 120000, paidAmount: 120000, dueDate: '2024-05-01', session: '2023/2024', term: Term.Third, status: 'paid' },
                    { id: 'fee1_2', type: 'Books', amount: 30000, paidAmount: 30000, dueDate: '2024-05-01', session: '2023/2024', term: Term.Third, status: 'paid' }
                ],
                payments: [],
                amountPaid: 150000
            },
            {
                id: 'stu_sunnydale_123_2', name: 'Aisha Bello', admissionNumber: 'SHS002', class: 'JSS1', dateOfBirth: '2012-07-22',
                parentName: 'Mrs. Bello', parentEmail: 'bello.a@example.com', parentPhone: '08011223344', address: 'Lagos, Nigeria',
                outstandingFees: 85000, debtRisk: RiskLevel.High, status: 'active',
                fees: [
                    { id: 'fee2_1', type: 'Tuition', amount: 120000, paidAmount: 80000, dueDate: '2024-05-01', session: '2023/2024', term: Term.Third, status: 'overdue' },
                    { id: 'fee2_2', type: 'Uniform', amount: 45000, paidAmount: 0, dueDate: '2024-05-01', session: '2023/2024', term: Term.Third, status: 'overdue' }
                ],
                payments: [],
                amountPaid: 80000
            },
            {
                id: 'stu_sunnydale_123_3', name: 'David Adeboye', admissionNumber: 'SHS003', class: 'SSS2', dateOfBirth: '2009-01-10',
                parentName: 'Mr. Adeboye', parentEmail: 'adeboye.d@example.com', parentPhone: '08055667788', address: 'Lagos, Nigeria',
                outstandingFees: 20000, debtRisk: RiskLevel.Medium, status: 'active',
                fees: [
                    { id: 'fee3_1', type: 'Tuition', amount: 150000, paidAmount: 150000, dueDate: '2024-05-01', session: '2023/2024', term: Term.Third, status: 'paid' },
                    { id: 'fee3_2', type: 'Lab Fees', amount: 50000, paidAmount: 30000, dueDate: '2024-05-01', session: '2023/2024', term: Term.Third, status: 'overdue' }
                ],
                payments: [],
                amountPaid: 180000
            }
        ],
        staff: [
            { id: 'tm_sunnydale_a1', name: 'Mrs. Adebayo', email: 'admin@sunnydale.com', phone: '08012345678', role: 'admin', salary: 200000, dateHired: '2023-01-15', status: 'active' },
            { id: 'tm_sunnydale_t1', name: 'Mr. James', email: 'teacher@sunnydale.com', phone: '08012345679', role: 'teacher', salary: 120000, dateHired: '2023-02-01', status: 'active' },
            { id: 'tm_sunnydale_s1', name: 'Funke Akindele', email: 'staff@sunnydale.com', phone: '08012345680', role: 'bursar', salary: 150000, dateHired: '2023-01-20', status: 'active' }
        ],
        teamMembers: [
            { id: 'tm_sunnydale_a1', name: 'Mrs. Adebayo', email: 'admin@sunnydale.com', phone: '08012345678', role: 'admin', salary: 200000, dateHired: '2023-01-15', status: 'active', assignedClasses: [] },
            { id: 'tm_sunnydale_t1', name: 'Mr. James', email: 'teacher@sunnydale.com', phone: '08012345679', role: 'teacher', salary: 120000, dateHired: '2023-02-01', status: 'active', assignedClasses: ['JSS1'] },
            { id: 'tm_sunnydale_s1', name: 'Funke Akindele', email: 'staff@sunnydale.com', phone: '08012345680', role: 'bursar', salary: 150000, dateHired: '2023-01-20', status: 'active', assignedClasses: [] }
        ],
        applicants: [
            { id: 'app1', name: 'New Applicant 1', applyingForClass: 'JSS1', dateOfBirth: '2013-02-11', parentName: 'Mr. New', parentEmail: 'new@example.com', parentPhone: '08012341234', applicationDate: new Date().toISOString(), status: ApplicationStatus.Applied, address: 'Lagos, Nigeria', email: 'new@example.com', phone: '08012341234' },
            { id: 'app2', name: 'New Applicant 2', applyingForClass: 'JSS1', dateOfBirth: '2013-03-12', parentName: 'Mrs. Test', parentEmail: 'test@example.com', parentPhone: '08043214321', applicationDate: new Date().toISOString(), status: ApplicationStatus.AwaitingTest, address: 'Abuja, Nigeria', email: 'test@example.com', phone: '08043214321' },
        ],
        feeDefinitions: [
            { id: 'fd1', name: 'Tuition', category: 'Academic', isRecurring: true, amounts: [{class: 'JSS1', amount: 120000, type: 'mandatory'}, {class: 'SSS2', amount: 150000, type: 'mandatory'}] },
            { id: 'fd2', name: 'Books', category: 'Academic', isRecurring: false, amounts: [{class: 'JSS1', amount: 30000, type: 'mandatory'}] },
            { id: 'fd3', name: 'Uniform', category: 'Supplies', isRecurring: false, amounts: [{class: 'JSS1', amount: 45000, type: 'optional'}] },
            { id: 'fd4', name: 'Lab Fees', category: 'Academic', isRecurring: true, amounts: [{class: 'SSS2', amount: 50000, type: 'mandatory'}] }
        ],
        planId: 'plan_enterprise',
        settings: {
            currency: 'NGN',
            academicYear: '2023/2024',
            terms: ['first', 'second', 'third'],
            gradeSystem: 'A-F',
            paymentMethods: ['card', 'bank_transfer', 'cash'],
            notifications: {
                emailEnabled: true,
                smsEnabled: true,
                whatsappEnabled: true,
                reminderDays: [3, 7, 14]
            }
        },
        smsSettings: {
            manualTemplates: []
        },
        communicationSettings: {
            manualTemplates: [],
            transactionalNotifications: {
                paymentConfirmation: {
                    emailSubject: 'Payment Confirmation',
                    emailTemplate: 'Thank you for your payment of ₦{amount} for {student}. Your receipt number is {reference}.'
                }
            }
        },
        currentSession: '2023/2024',
        currentTerm: 'third',
        otherIncome: [],
        expenditures: []
    }
];

export const mockPlatformConfig: PlatformConfig = {
    id: 'platform_config_1',
    websiteContent: {
        title: 'SchoolFees.NG',
        description: 'The Smart Way to Manage School Fees',
        tagline: 'Join hundreds of Nigerian schools simplifying fee collection',
        features: [
            { id: 'feat1', title: 'Automated Reminders', description: 'Never chase a payment again. Our system automatically sends polite SMS and email reminders to parents about outstanding fees.', icon: 'Communication', imageUrl: 'https://placehold.co/1200x800/E0E7FF/4F46E5/png?text=Automated+Reminders' },
            { id: 'feat2', title: 'Multiple Payment Options', description: 'Accept payments from parents via card, bank transfer, USSD, Paystack, and Flutterwave, providing maximum convenience.', icon: 'Payments', imageUrl: 'https://placehold.co/1200x800/D1FAE5/059669/png?text=Online+Payments' },
            { id: 'feat3', title: 'AI-Powered Insights', description: 'Get a clear view of your school\'s financial health. Our AI predicts debt risks and provides actionable recommendations to improve your revenue.', icon: 'Analytics', imageUrl: 'https://placehold.co/1200x800/FEF3C7/D97706/png?text=AI+Insights' }
        ],
        testimonials: {
            title: 'What School Administrators Are Saying',
            items: [
                { id: 'test1', quote: 'SchoolFees.NG has reduced our administrative workload by at least 50%. Reconciliation is now a breeze!', name: 'Mrs. Chika Okonkwo', title: 'Proprietress, Bright Stars Academy' },
                { id: 'test2', quote: 'The parent portal is fantastic. Our parents love the transparency and ease of payment.', name: 'Mr. David Audu', title: 'Bursar, Kings College Lagos' },
                { id: 'test3', quote: 'The AI insights feature is a game-changer. It helped us identify potential defaulters early and engage them proactively.', name: 'Dr. Amina Yusuf', title: 'Head of School, The Learning Tree' }
            ]
        },
        theme: 'blue',
        contactInfo: {
            email: 'support@schoolfees.ng',
            phone: '+2348012345678',
            address: 'Lagos, Nigeria'
        }
    },
    pricingPlans: [
        { id: 'plan_starter', name: 'Starter', prices: { monthly: 15000, yearly: 100000 }, limits: { students: 100, staff: 5, storage: '10GB' }, features: ['Up to 100 Students', 'Online Payment Collection', 'Automated Receipts', 'Basic Reporting'] },
        { id: 'plan_advanced', name: 'Advanced', prices: { monthly: 35000, yearly: 250000 }, limits: { students: 500, staff: 20, storage: '50GB' }, features: ['Up to 500 Students', 'All Starter Features', 'Automated Reminders', 'Communication Center'] },
        { id: 'plan_enterprise', name: 'Enterprise', prices: { monthly: 75000, yearly: 550000 }, limits: { students: 2000, staff: 50, storage: 'Unlimited' }, features: ['Unlimited Students', 'All Advanced Features', 'AI Debt Insights', 'Payroll Management', 'Dedicated Support'] }
    ],
    knowledgeBaseArticles: [
        { id: 'kb1', title: 'How to Add a New Student', content: '## Adding Students\nTo add a new student, navigate to the **Students** page and click the "Add New Student" button.', category: 'Students', status: 'published', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: [] },
        { id: 'kb2', title: 'Setting Up Your Fee Structure', content: 'This is an article about setting up fees.', category: 'Settings', status: 'published', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: [] }
    ],
    supportConfig: {
        email: 'support@schoolfees.ng',
        phone: '+2348012345678',
        chatEnabled: true,
        ticketingEnabled: true,
        knowledgeBaseEnabled: true
    }
};
