module.exports = {
  apps: [
    {
      name: 'horselogo-backend',
      script: 'src/index.js',
      cwd: '/var/www/horselogo/backend',
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      env_file: '/var/www/horselogo/backend/.env',
      error_file: '/var/log/pm2/horselogo-error.log',
      out_file: '/var/log/pm2/horselogo-out.log',
      log_file: '/var/log/pm2/horselogo-combined.log',
      time: true,
      max_memory_restart: '512M',
      restart_delay: 3000,
      autorestart: true,
    },
  ],
}
