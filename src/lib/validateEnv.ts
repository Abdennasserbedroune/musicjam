export function validateEnv() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn(
      '⚠️  Missing environment variables:',
      missingVars.join(', '),
    );
    console.warn(
      '⚠️  Please set these in your .env.local file. See .env.example for reference.',
    );
  }

  return missingVars.length === 0;
}
