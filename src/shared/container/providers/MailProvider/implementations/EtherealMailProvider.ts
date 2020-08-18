import { inject, injectable } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IMailProviderDTO from '@shared/container/providers/MailProvider/dtos/IMailProviderDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
    private client: Transporter;

    private mailTemplateProvider: IMailTemplateProvider;

    constructor(
        @inject('MailTemplateProvider')
        mailTemplateProvider: IMailTemplateProvider,
    ) {
        this.mailTemplateProvider = mailTemplateProvider;
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass,
                },
            });

            this.client = transporter;
        });
    }

    public async sendEmail({
        to,
        from,
        subject,
        templateData,
    }: IMailProviderDTO): Promise<void> {
        const message = await this.client.sendMail({
            from: {
                name: from?.name || 'Equipe GoBarber',
                address: from?.email || 'equipe@gobarber.com.br',
            },
            to: {
                name: to.name,
                address: to.email,
            },
            subject,
            html: await this.mailTemplateProvider.parse(templateData),
        });

        // console.log('--email---', message.messageId);
        console.log(nodemailer.getTestMessageUrl(message));
    }
}
