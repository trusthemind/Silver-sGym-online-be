declare var process: {
    env: {
        NODE_ENV: string;
        PORT: string;
        DB_URL: string;
        JWT_SECRET: string;
        UPLOAD_DIR: string;
    };
    exit();
};
