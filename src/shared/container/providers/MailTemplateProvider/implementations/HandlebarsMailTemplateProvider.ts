import fs from 'fs';
import handlebars from 'handlebars';
import IMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IMailTemplateDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
    public async parse({ file, variables }: IMailTemplateDTO): Promise<string> {
        const templateFromFile = await fs.promises.readFile(file, {
            encoding: 'utf-8',
        });

        const handlebarTemplateDelegater = handlebars.compile(templateFromFile);

        return handlebarTemplateDelegater(variables);
    }
}

export default HandlebarsMailTemplateProvider;
