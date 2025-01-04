import session from 'express-session';
// import { createClient } from 'redis';
// import { default as connectRedis } from 'connect-redis'; 

// const RedisStore = connectRedis(session); 

// const redisClient = createClient({
//     url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
//     password: process.env.REDIS_PASSWORD || '',
// });

// redisClient.connect().catch(console.error);

// const sessionConfig = session({
//     store: new RedisStore({ client: redisClient }),
//     secret: process.env.SESSION_SECRET!,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: process.env.NODE_ENV === 'production',
//         httpOnly: true,
//         maxAge: 1000 * 60 * 60 * 24 * 7, 
//     },
// });




const sessionConfig = session({
    secret: process.env.SESSION_SECRET!, 
    resave: false, 
    saveUninitialized: false, 
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true, 
      maxAge: 1000 * 60 * 60 * 24 * 7, 
    },
});

export default sessionConfig;