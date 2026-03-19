module.exports = {
  apps: [
    {
      name: 'miclean-website',
      script: 'server.js',
      instances: 'max',          // one worker per CPU core
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '300M',

      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      out_file: './logs/pm2-out.log',
      error_file: './logs/pm2-err.log',
      merge_logs: true,

      // Restart policy
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: '5s',
    },
  ],
};
