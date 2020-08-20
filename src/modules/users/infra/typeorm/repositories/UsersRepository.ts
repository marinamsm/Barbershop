import { getRepository, Repository, Not } from 'typeorm';
import { classToClass } from 'class-transformer';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

export default class UsersRepository implements IUsersRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    public async create({
        name,
        email,
        password,
    }: ICreateUserDTO): Promise<User> {
        const user = this.ormRepository.create({ name, email, password });

        await this.ormRepository.save(user);

        return classToClass(user);
    }

    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    }

    public async findById(id: string): Promise<User | undefined> {
        return this.ormRepository.findOne(id);
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        return this.ormRepository.findOne({
            where: {
                email,
            },
        });
    }

    public async findAllProviders({
        exceptOwnId,
    }: IFindAllProvidersDTO): Promise<User[]> {
        const where = {
            id: Not('invalid-id'),
        };

        if (exceptOwnId) {
            where.id = Not(exceptOwnId);
        }

        return this.ormRepository.find(where);
    }
}
