import 'module-alias/register';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Logger } from '@nestjs/common';
import { typeOrmOptions } from '~/config';
import { UserController } from '~/user/user.controller';
import { UserModule } from '~/user/user.module';
import { AuthModule } from '~/auth/auth.module';
import { FtsModule } from '~/fts/fts.module';
import { BillModule } from '~/bill/bill.module';
import { ShopModule } from '~/shop/shop.module';
import { PurchaseModule } from '~/purchase/purchase.module';
import { ProductModule } from '~/product/product.module';
import { BillRequestModule } from '~/bill-request/bill-request.module';
import { CategoryModule } from '~/category/category.module';
import { BillProviderModule } from '~/bill-provider/bill-provider.module';
import { OfdModule } from '~/ofd/ofd.module';
import { DadataModule } from '~/dadata/dadata.module';
import { MapsModule } from '~/maps/maps.module';
import { DefaultModule } from '~/default/default.module';
import { EmailModule } from '~/email/email.module';
import { SubscriptionModule } from '~/subscription/subscription.module';
import { ProxyModule } from '~/proxy/proxy.module';
import { PuppeteerModule } from '~/puppeteer/puppeteer.module';
import { MessageModule } from '~/message/message.module';
import { ProvidersModule } from '~/providers/providers.module';
import { Empty } from '~/providers/empty';
import { TokenDto } from '~/user/dto/token.dto';

jest.setTimeout(30 * 1000);

const notExistUserEmail = 'notExist@email.com';
const existUserEmail = 'exist@email.com';
const password = '123456';

describe('User controller tests', () => {
  let userController: UserController;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmOptions),
        PassportModule,
        UserModule,
        AuthModule,
        FtsModule,
        BillModule,
        ShopModule,
        PurchaseModule,
        ProductModule,
        BillRequestModule,
        CategoryModule,
        BillProviderModule,
        OfdModule,
        DadataModule,
        MapsModule,
        DefaultModule,
        EmailModule,
        SubscriptionModule,
        ProxyModule,
        PuppeteerModule,
        MessageModule,
        ProvidersModule,
      ],
    }).compile();
    userController = module.get(UserController);
  });

  afterAll(async () => {
    Logger.log('Need to clear DB');
  });

  it('SignUp not exist user', async done => {
    const response = await userController.signUp({ email: notExistUserEmail, password });
    expect(response).toBeInstanceOf(Empty);
    done();
  });

  it('SignUp with existed user', async done => {
    await userController.signUp({ email: existUserEmail, password });
    let err: Error = null;
    try {
      await userController.signUp({ email: existUserEmail, password });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
    done();
  });

  it('SignIn method with correct password', async done => {
    const response = await userController.signIn({ email: existUserEmail, password });
    expect(response).toBeInstanceOf(TokenDto);
    done();
  });

  it('SignIn with incorrect password', async done => {
    let err: Error = null;
    try {
      await userController.signIn({ email: existUserEmail, password: `${ password }_` });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
    done();
  });
});