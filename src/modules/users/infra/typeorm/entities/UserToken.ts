import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Generated,
} from 'typeorm';

@Entity('user_tokens')
class UserToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    @Generated('uuid')
    token: string;

    @Column('varchar', { name: 'user_id' })
    userId: string;

    @CreateDateColumn({ name: 'created_at', update: false })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}

export default UserToken;
