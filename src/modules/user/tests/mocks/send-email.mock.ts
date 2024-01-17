import {
  EmailClientInterface,
  SendEmailOptions,
} from '@core/domain/contracts/email-client.interface';

export const SendEmailMock: jest.Mocked<EmailClientInterface> = {
  sendEmail: jest.fn(async (settings: SendEmailOptions) => {
    return true;
  }),
};
