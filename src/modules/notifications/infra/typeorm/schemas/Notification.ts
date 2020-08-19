import {
    ObjectID,
    ObjectIdColumn,
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('notifications')
class Notification {
    @ObjectIdColumn()
    id: ObjectID;

    @Column({ type: 'varchar' })
    content: string;

    @Column({ name: 'recipient_id', type: 'uuid' })
    recipientId: string;

    @Column({ type: 'boolean', default: false })
    read: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}

export default Notification;
