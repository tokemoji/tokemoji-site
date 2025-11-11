module.exports = {
  apps: [{
    name: 'tokemoji-poller',
    script: './backend/services/tokemoji-poller.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '200M',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/poller-error.log',
    out_file: './logs/poller-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
