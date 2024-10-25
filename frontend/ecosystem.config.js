module.exports = {
  apps: [
    {
      name: 'next-app',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 443,
        HOST: '146.83.198.35',
        NODE_ENV: 'production',
      },
    },
  ],
};
