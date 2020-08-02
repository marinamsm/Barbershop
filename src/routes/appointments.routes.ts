import { Router } from 'express';
import { parseISO } from 'date-fns';
import {getCustomRepository} from 'typeorm';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';
import authenticate from '../middlewares/authentication';

const appointmentsRouter = Router();

appointmentsRouter.use(authenticate);

appointmentsRouter.post('/', async (request, response) => {
    const { providerId, date } = request.body;

    const parsedDate = parseISO(date);

    const appointmentCreation = new CreateAppointmentService();

    const newAppointment = await appointmentCreation.execute({providerId, date: parsedDate});

    return response.json(newAppointment);
});

appointmentsRouter.get('/', async (request, response) => {
    // console.log('userData: ', request.user);
    const appointmentRepository = getCustomRepository(AppointmentsRepository);
    const appointments = await appointmentRepository.find();

    return response.json(appointments);
})

export default appointmentsRouter;
