import IMailProviderDTO from '@shared/container/providers/MailProvider/dtos/IMailProviderDTO';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

export default class FakeMailProvider implements IMailProvider {
    public async sendEmail(data: IMailProviderDTO): Promise<void> {
        console.log('--- Fake email sent --- ');
    }
}
