export const environment = {
  production: true,
  apiUrl: (window as any)['__env']?.apiUrl || 'https://YOUR-JAVA-SERVICE.onrender.com/api',
  goUrl:  (window as any)['__env']?.goUrl  || 'https://YOUR-GO-SERVICE.onrender.com',
  githubUsername: 'GAURAVKB',
  githubRepo: 'portfolio',
};
