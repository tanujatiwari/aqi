import cron from 'node-cron'
import axios from 'axios'
import client from '../redis'
import { DatabaseService,DatabaseQueries } from '../db'

class Cron {
    private databaseService: DatabaseService

    constructor(databaseService: DatabaseService) {
        this.databaseService = databaseService
    }

    lockCron = async () => {
        const res = await client.set('cron:lock', `${process.pid}`, { NX: true })
        if (res !== "OK") {
            return console.log('Already locked. returning from process id', process.pid)
        }
        console.log('Job started by process id', process.pid)
        const allStations = await this.databaseService.getAllStations();
        for (let i = 0; i < allStations.length; i++) {
            const geopoint = allStations[i].geopoint
            const { x: lat, y: lon } = geopoint
            const apiResponse = await axios.get(`http://api.waqi.info/feed/geo:${lat};${lon}/?token=${process.env.WEATHER_API_KEY}`)
            const aqi = apiResponse.data.data.aqi
            const currTime = new Date().toISOString()
            await this.databaseService.insertAqi(allStations[i].id, aqi, currTime)
        }
        console.log('inserting aqi...');
        this.releaseKey('cron:lock', process.pid)
    }

    releaseKey = async (key: string, value: number) => {
        console.log('I am hereeee-----')
        const keyValue = await client.get(key)
        const valueToCompare = value.toString()
        if (keyValue === null) {
            return;
        }
        if (keyValue === valueToCompare && value != null) {
            await client.del(key)
        }
        else {
            return console.log('Incorrect key value pair given')
        }
    }
}

const cronObject = new Cron(new DatabaseQueries())

const job = cron.schedule('* * * * *', async () => {
    console.log('fuck this shit')
    cronObject.lockCron()
});

export default job;