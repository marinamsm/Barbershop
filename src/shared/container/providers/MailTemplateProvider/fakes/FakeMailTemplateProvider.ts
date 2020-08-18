import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

class FakeMailTemplateProvider implements IMailTemplateProvider {
    public async parse(): Promise<string> {
        return 'Email sent';
    }
}

export default FakeMailTemplateProvider;
