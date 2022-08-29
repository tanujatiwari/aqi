import * as redis from 'redis'

const client = redis.createClient({
    socket: {
        host: `${process.env.REDIS_HOST}`,
        port: 6380
    },
    password: `${process.env.REDIS_PASSWORD}`
});

const connectRedis = () => {
    const redisClient = client.connect();
    redisClient.then(async () => {
        console.log('Connection with Redis established for process...', process.pid)
    })
        .catch(e => {
            console.log('Connection refused...', e)
        })
}

connectRedis()

export default client