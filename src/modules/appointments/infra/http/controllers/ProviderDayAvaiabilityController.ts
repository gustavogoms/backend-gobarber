/* eslint-disable camelcase */
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderDayAviabilityService from '@modules/appointments/services/ListProviderDayAviabilityService';

export default class ProviderDayAvaiabilityController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const {provider_id} = request.params;
        const { day, month, year } = request.body;

        const listProviderDayAviability = container.resolve(ListProviderDayAviabilityService);
        const aviability = await listProviderDayAviability.execute({
            provider_id, day, month, year,
        });

        return response.json(aviability);
    }
}
