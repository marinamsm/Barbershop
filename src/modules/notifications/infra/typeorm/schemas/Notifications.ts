import {
    ObjectID,
    ObjectIdColumn,
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('notifications')
class Notifications {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    content: string;

    @Column({ name: 'recipient_id', type: 'uuid' })
    recipientId: string;

    @Column({ default: false })
    read: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}

export default Notifications;
