module.exports = {
    apps: [
        {
            name: 'TEST',
            script: 'index.js', // Entry point of your application
            watch: true, // Enable watching of file changes
            ignore_watch: ['node_modules', 'logs'], // Ignore changes in these directories
            watch_options: {
                followSymlinks: false,
            },
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
}
