import { PlatformConfig } from '../types';

/**
 * Normalizes PlatformConfig to handle backward compatibility with legacy theme formats
 * and different Supabase data shapes (row wrapper vs direct data)
 */
export const normalizePlatformConfig = (config: any): PlatformConfig => {
  if (!config) return config;
  
  // Handle both shapes: direct config or Supabase row with data column
  const raw = config.data ?? config;
  
  if (!raw) return config;
  
  // Create a deep copy to avoid mutations
  const normalized = JSON.parse(JSON.stringify(raw));
  
  // Normalize theme property if websiteContent exists
  if (normalized.websiteContent && normalized.websiteContent.theme) {
    const theme = normalized.websiteContent.theme;
    
    // If theme is a string, convert to object using the string as primary color
    if (typeof theme === 'string') {
      normalized.websiteContent.theme = {
        primary: theme,
        secondary: '#64748b',
        accent: '#8b5cf6'
      };
    } 
    // If theme is an object, ensure all required properties exist
    else if (typeof theme === 'object' && theme !== null) {
      normalized.websiteContent.theme = {
        primary: theme.primary || '#3b82f6',
        secondary: theme.secondary || '#64748b',
        accent: theme.accent || '#8b5cf6'
      };
    }
  }
  
  return normalized as PlatformConfig;
};