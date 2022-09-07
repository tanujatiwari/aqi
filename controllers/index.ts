import { Request, Response, NextFunction } from "express";

import { MockDatabaseService } from '../db/mock'
import { DatabaseService } from '../db/index'

class UserControllers {
    private databaseService: MockDatabaseService

    constructor(databaseService: MockDatabaseService) {
        this.databaseService = databaseService;
    }

    home = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { date, lat, lon } = req.body
            const inDelhi = await this.databaseService.checkInDelhi({ lat, lon })
            if (inDelhi > 35) {
                return res.json({
                    message: "This location exists outside of Delhi. No AQI available"
                })
            }
            const nearestStationId = await this.databaseService.getNearestStation({ lat, lon })
            const isoDate = new Date(date).toISOString()
            const aqis = await this.databaseService.getAqi(isoDate, nearestStationId)
            console.log({data:aqis})
            return res.json({ data: aqis })
        }
        catch (e) {
            next(e)
        }
    };

    async notFound(req: Request, res: Response, next: NextFunction) {
        const err: CustomError = new Error(`Cannot ${req.method} ${req.path}`)
        err.statusCode = 404
        err.clientMessage = `Requested URL ${req.path} not found`
        next(err)
    }

}

export default UserControllers