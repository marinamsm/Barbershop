import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

@Entity('appointments')
class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', {name: 'provider_id'})
    providerId: string;

    @ManyToOne(() => User)
    @JoinColumn({name: 'provider_id'})
    provider: User

    @Column('timestamp with time zone')
    date: Date;

    @CreateDateColumn({name: 'created_at', update: false})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;
}

export default Appointment;
