export default () => ({
  port: parseInt(process.env.PORT ?? '4000', 10),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
  storage: {
    driver: process.env.STORAGE_DRIVER ?? 'local'
  },
  sora: {
    apiKey: process.env.SORA_API_KEY ?? '',
    baseUrl: process.env.SORA_BASE_URL ?? ''
  }
});
