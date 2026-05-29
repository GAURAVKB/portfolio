export const environment = {
  production: true,
  apiUrl: (window as any)['__env']?.apiUrl || 'https://portfolio-api-5s5r.onrender.com/api',
  goUrl:  (window as any)['__env']?.goUrl  || 'https://go-metrics.onrender.com',
  githubUsername: 'GAURAVKB',
  githubRepo: 'portfolio',
};
