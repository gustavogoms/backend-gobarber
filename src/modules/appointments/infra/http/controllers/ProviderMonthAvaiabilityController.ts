/* eslint-disable camelcase */
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderMonthAviabilityService from '@modules/appointments/services/ListProviderMonthAviabilityService';

export default class ProviderMonthAvaiabilityController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const {provider_id} = request.params;

        const { month, year } = request.body;

        const listProviderMonthAviability = container.resolve(ListProviderMonthAviabilityService);
        const aviability = await listProviderMonthAviability.execute({
            provider_id, month, year,
        });

        return response.json(aviability);
    }
}
