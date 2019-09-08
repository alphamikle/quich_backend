import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_SYNC } = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_HOST,
      port: 5432,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: [ __dirname + '/**/*.entity{.ts,.js}' ],
      synchronize: DB_SYNC === 'true',
    }),
    UserModule,
    AuthModule,
    PassportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
