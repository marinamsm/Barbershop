import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    name: string;

    @Column('varchar')
    email: string;

    @Column('varchar')
    password: string;

    @Column('varchar')
    avatar: string;

    @CreateDateColumn({name: 'created_at', update: false})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at', })
    updatedAt: Date;
}

export default User;
