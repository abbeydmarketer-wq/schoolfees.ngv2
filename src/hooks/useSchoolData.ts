import { useState, useEffect } from 'react';
import { School, PlatformConfig } from '../types';
import { getSupabase } from '../supabaseClient';
import { normalizePlatformConfig } from '../utils/normalizePlatformConfig';
import { mockSchools, mockPlatformConfig } from '../services/mockData';

interface UseSchoolDataReturn {
  schools: School[];
  platformConfig: PlatformConfig | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const useSchoolData = (): UseSchoolDataReturn => {
  const [schools, setSchools] = useState<School[]>([]);
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    // We will use mock data for development.
    setSchools(mockSchools);
    setPlatformConfig(normalizePlatformConfig(mockPlatformConfig));
    setIsLoading(false);
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