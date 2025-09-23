import { useState, useEffect } from 'react';
import { School, PlatformConfig } from '../types';
import { getSupabase } from '../supabaseClient';

interface UseSchoolDataReturn {
  schools: School[];
  platformConfig: PlatformConfig | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

// Mock data for offline/development mode
const mockSchools: School[] = [
  {
    id: 'school-1',
    name: 'Demo Primary School',
    address: '123 Education Street, Lagos, Nigeria',
    email: 'admin@demoprimary.edu.ng',
    phone: '+234-803-123-4567',
    slug: 'demo-primary',
    currentSession: '2024/2025',
    currentTerm: 'First Term',
    planId: 'basic',
    students: [],
    staff: [],
    feeDefinitions: [
      {
        id: 'fee-1',
        name: 'Tuition Fee',
        category: 'Academic',
        amounts: [
          { class: 'Primary 1', amount: 45000, type: 'mandatory' },
          { class: 'Primary 2', amount: 48000, type: 'mandatory' },
          { class: 'Primary 3', amount: 50000, type: 'mandatory' }
        ],
        isRecurring: true,
        description: 'Termly tuition fee'
      }
    ],
    settings: {
      currency: 'NGN',
      academicYear: '2024/2025',
      terms: ['First Term', 'Second Term', 'Third Term'],
      gradeSystem: 'A-F',
      paymentMethods: ['Bank Transfer', 'Card Payment', 'Cash'],
      notifications: {
        emailEnabled: true,
        smsEnabled: true,
        whatsappEnabled: false,
        reminderDays: [7, 3, 1]
      }
    }
  }
];

const mockPlatformConfig: PlatformConfig = {
  id: 'platform-1',
  websiteContent: {
    title: 'SchoolFee.NG',
    tagline: 'Smart School Fees Management for Nigerian Schools',
    description: 'Streamline fee collection, track payments, and improve school finances with our comprehensive management system.',
    features: [
      {
        id: 'feature-1',
        title: 'Easy Payment Collection',
        description: 'Accept payments via multiple channels including bank transfer, cards, and mobile money.',
        imageUrl: '/images/payment-collection.jpg'
      },
      {
        id: 'feature-2',
        title: 'Real-time Analytics',
        description: 'Get insights into payment patterns, outstanding debts, and financial health.',
        imageUrl: '/images/analytics.jpg'
      }
    ],
    testimonials: {
      title: 'What Our Schools Say',
      items: [
        {
          id: 'testimonial-1',
          name: 'Mrs. Adebayo',
          title: 'Principal, Bright Future Academy',
          quote: 'SchoolFee.NG has transformed how we manage our school finances. Payment collection is now seamless!'
        }
      ]
    },
    theme: 'light',
    contactInfo: {
      email: 'hello@schoolfee.ng',
      phone: '+234-809-876-5432',
      address: 'Lagos, Nigeria'
    }
  },
  pricingPlans: [
    {
      id: 'basic',
      name: 'Basic',
      prices: { monthly: 5000, yearly: 50000 },
      features: ['Up to 100 students', 'Basic reporting', 'Email support'],
      limits: { students: 100, staff: 5, storage: '1GB' }
    },
    {
      id: 'advanced',
      name: 'Advanced',
      prices: { monthly: 15000, yearly: 150000 },
      features: ['Up to 500 students', 'Advanced analytics', 'SMS notifications', 'Priority support'],
      isPopular: true,
      limits: { students: 500, staff: 20, storage: '5GB' }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      prices: { monthly: 30000, yearly: 300000 },
      features: ['Unlimited students', 'AI insights', 'WhatsApp integration', 'Dedicated support'],
      limits: { students: -1, staff: -1, storage: 'Unlimited' }
    }
  ],
  knowledgeBaseArticles: [
    {
      id: 'kb-1',
      title: 'Getting Started Guide',
      content: 'Welcome to SchoolFee.NG! This guide will help you set up your school account...',
      category: 'Getting Started',
      tags: ['setup', 'beginner'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      status: 'published'
    }
  ],
  supportConfig: {
    email: 'support@schoolfee.ng',
    phone: '+234-809-876-5432',
    chatEnabled: true,
    ticketingEnabled: true,
    knowledgeBaseEnabled: true
  }
};

const useSchoolData = (): UseSchoolDataReturn => {
  const [schools, setSchools] = useState<School[]>([]);
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const supabase = getSupabase();
      
      if (supabase) {
        // Try to fetch from Supabase
        try {
          // Fetch schools
          const { data: schoolsData, error: schoolsError } = await supabase
            .from('schools')
            .select('*');
          
          if (schoolsError) throw schoolsError;
          
          // Fetch platform config
          const { data: configData, error: configError } = await supabase
            .from('platform_config')
            .select('*')
            .single();
          
          if (configError && configError.code !== 'PGRST116') { // PGRST116 is "not found"
            throw configError;
          }
          
          setSchools(schoolsData || mockSchools);
          setPlatformConfig(configData || mockPlatformConfig);
        } catch (supabaseError) {
          console.log('Supabase query failed, using mock data:', supabaseError);
          // Fall back to mock data
          setSchools(mockSchools);
          setPlatformConfig(mockPlatformConfig);
        }
      } else {
        // No Supabase connection, use mock data
        console.log('No Supabase connection, using mock data');
        setSchools(mockSchools);
        setPlatformConfig(mockPlatformConfig);
      }
    } catch (err) {
      console.error('Data fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      // Still provide mock data even if there's an error
      setSchools(mockSchools);
      setPlatformConfig(mockPlatformConfig);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    schools,
    platformConfig,
    isLoading,
    error,
    refreshData
  };
};

export default useSchoolData;