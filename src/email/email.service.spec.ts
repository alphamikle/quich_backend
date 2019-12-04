import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ EmailService ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('Send test email', async () => {
    service.initialize({ host: '', password: '', username: '', port: 0 });
    await service.sendTextEmail({ from: '', to: '', text: '', title: '' });
    expect(undefined).toBeUndefined();
  });
});
