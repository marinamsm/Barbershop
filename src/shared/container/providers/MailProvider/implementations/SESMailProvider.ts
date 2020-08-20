import { inject, injectable } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import mailConfig from '@config/mail';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IMailProviderDTO from '@shared/container/providers/MailProvider/dtos/IMailProviderDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class SESMailProvider implements IMailProvider {
    private client: Transporter;

    private mailTemplateProvider: IMailTemplateProvider;

    constructor(
        @inject('MailTemplateProvider')
        mailTemplateProvider: IMailTemplateProvider,
    ) {
        this.mailTemplateProvider = mailTemplateProvider;

        this.client = nodemailer.createTransport({
            SES: new aws.SES({
                apiVersion: '2010-12-01',
                region: process.env.AWS_DEFAULT_REGION,
            }),
        });
    }

    public async sendEmail({
        to,
        from,
        subject,
        templateData,
    }: IMailProviderDTO): Promise<void> {
        const { name, email } = mailConfig.defaults.from;
        await this.client.sendMail({
            from: {
                name: from?.name || name,
                address: from?.email || email,
            },
            to: {
                name: to.name,
                address: to.email,
            },
            subject,
            html: await this.mailTemplateProvider.parse(templateData),
        });
    }
}
