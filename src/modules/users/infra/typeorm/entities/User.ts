import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import uploadConfig from '@config/upload';

@Entity('users')
class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    name: string;

    @Column('varchar')
    email: string;

    @Column('varchar')
    @Exclude()
    password: string;

    @Column('varchar')
    avatar: string;

    @CreateDateColumn({ name: 'created_at', update: false })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Expose({ name: 'avatar' })
    getAvatarUrl(): string | null {
        if (!this.avatar) {
            return null;
        }

        switch (process.env.STORAGE_DRIVER) {
            case 'disk':
                return `${process.env.APP_API_URL}/files/${this.avatar}`;
            case 's3':
                return `https://${uploadConfig.config.s3.bucket}.s3.amazonaws.com/${this.avatar}`;
            default:
                return null;
        }
    }
}

export default User;
