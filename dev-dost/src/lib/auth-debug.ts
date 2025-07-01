// Debug utilities for authentication issues
export const logAuthError = (error: any, context: string) => {
  console.error(`🔥 Auth Error in ${context}:`, {
    error: error.message,
    stack: error.stack,
    name: error.name,
    cause: error.cause,
    timestamp: new Date().toISOString(),
  });
};

export const logAuthSuccess = (context: string, data?: any) => {
  console.log(`✅ Auth Success in ${context}:`, {
    data: data ? JSON.stringify(data, null, 2) : 'No data',
    timestamp: new Date().toISOString(),
  });
};

export const checkEnvVars = () => {
  const required = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET', 
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'MONGODB_URI'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('🚨 Missing environment variables:', missing);
    return false;
  }

  console.log('✅ All required environment variables are set');
  return true;
};