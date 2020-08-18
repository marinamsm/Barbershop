import IMailProviderDTO from '@shared/container/providers/MailProvider/dtos/IMailProviderDTO';

export default interface IMailProvider {
    sendEmail(data: IMailProviderDTO): Promise<void>;
}
