export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://navy-fortress-api.nigroan67.workers.dev'
  : '';  // Empty string will use relative URLs that get proxied in development 