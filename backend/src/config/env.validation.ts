import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().optional(),
  FRONTEND_ORIGIN: z.string().optional(),
  STORAGE_DRIVER: z.enum(['local']).optional(),
  SORA_API_KEY: z.string().optional(),
  SORA_BASE_URL: z.string().optional()
});

export type EnvironmentVariables = z.infer<typeof envSchema>;

export const validateEnv = (config: Record<string, unknown>) => {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    throw new Error(`Invalid environment variables: ${parsed.error.message}`);
  }

  return parsed.data;
};
