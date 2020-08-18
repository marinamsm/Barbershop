import { uuid } from 'uuidv4';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

export default class UsersRepository implements IUsersRepository {
    private users: User[];

    constructor() {
        this.users = [];
    }

    public async create({
        name,
        email,
        password,
    }: ICreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, { id: uuid(), name, email, password });

        this.users.push(user);

        const result = { ...user };

        delete result.password;

        return result;
    }

    public async save(user: User): Promise<User> {
        const userToUpdateIndex = this.users.findIndex(
            currUser => currUser.id === user.id,
        );
        this.users[userToUpdateIndex] = user;

        return this.users[userToUpdateIndex];
    }

    public async findById(id: string): Promise<User | undefined> {
        return this.users.find(user => user.id === id);
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const user = this.users.find(currUser => currUser.email === email);
        return user;
    }

    public async findAllProviders({
        exceptOwnId,
    }: IFindAllProvidersDTO): Promise<User[]> {
        let { users } = this;

        if (exceptOwnId) {
            users = this.users.filter(user => user.id !== exceptOwnId);
        }

        const resultingUsers = [...users];

        /* eslint-disable no-param-reassign */
        resultingUsers.forEach(user => {
            delete user.password;
        });

        return users;
    }
}
