import { inject, injectable } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
    userId?: string;
}

@injectable()
class ListProvidersService {
    private usersRepository: IUsersRepository;

    constructor(
        @inject('UsersRepository')
        usersRepository: IUsersRepository,
    ) {
        this.usersRepository = usersRepository;
    }

    public async execute({ userId }: IRequest): Promise<User[]> {
        return this.usersRepository.findAllProviders({ exceptOwnId: userId });
    }
}

export default ListProvidersService;
