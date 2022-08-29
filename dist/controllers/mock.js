"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class UserControllers {
    constructor(datbaseService) {
        this.home = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { date, lat, lon } = req.body;
                const inDelhi = yield this.databaseService.checkInDelhi({ lat, lon });
                if (inDelhi.rows[0].distance > 35) {
                    return res.json({
                        message: "This location exists outside of Delhi. No AQI available"
                    });
                }
                const nearestStationId = yield this.databaseService.getNearestStation({ lat, lon });
                const isoDate = new Date(date).toISOString();
                const aqis = yield this.databaseService.getAqi(isoDate, nearestStationId.rows[0].id);
                res.json(aqis.rows);
            }
            catch (e) {
                next(e);
            }
        });
        this.databaseService = datbaseService;
    }
    notFound(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const err = new Error(`Cannot ${req.method} ${req.path}`);
            err.statusCode = 404;
            err.clientMessage = `Requested URL ${req.path} not found`;
            next(err);
        });
    }
}
exports.default = UserControllers;
