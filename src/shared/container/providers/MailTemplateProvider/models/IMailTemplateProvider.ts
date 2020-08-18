import IMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IMailTemplateDTO';

export default interface IMailTemplateProvider {
    parse(data: IMailTemplateDTO): Promise<string>;
}
