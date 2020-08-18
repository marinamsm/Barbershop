import { getMongoRepository, MongoRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

class NotificationsRepository implements INotificationRepository {
    private ormRepository: MongoRepository<Notification>;

    constructor() {
        this.ormRepository = getMongoRepository(Notification, 'mongodb');
    }

    public async create({
        content,
        recipientId,
    }: ICreateNotificationDTO): Promise<Notification> {
        const notification = this.ormRepository.create({
            content,
            recipientId,
            read: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await this.ormRepository.save(notification);

        return notification;
    }
}

export default NotificationsRepository;
