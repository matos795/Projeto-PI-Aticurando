import type { Request, Response} from "express";
import dashboardService from "./dashboard.service.js";


class DashboardController {

    public async findAll(request: Request, response: Response) : Promise<Response>{
        const dashboardData = await dashboardService.findAll();

        return response.status(200).json(dashboardData);
    }

}

export default new DashboardController()
