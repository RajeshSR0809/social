const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'social',
    mongoURI: process.env.MONGO_URI || process.env.MONGO_HOST || "mongodb://127.0.0.1:27017/social"
}

export default config;