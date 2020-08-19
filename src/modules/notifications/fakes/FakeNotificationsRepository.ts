import { ObjectID } from 'mongodb';
import AppError from '@shared/errors/AppError';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

class FakeNotificationsRepository implements INotificationsRepository {
    private notifications: Notification[];

    constructor() {
        this.notifications = [];
    }

    public async create({
        content,
        recipientId,
    }: ICreateNotificationDTO): Promise<Notification> {
        const notification = new Notification();

        Object.assign(notification, {
            id: new ObjectID(),
            content,
            recipientId,
            read: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        this.notifications.push(notification);

        return notification;
    }
}

export default FakeNotificationsRepository;
