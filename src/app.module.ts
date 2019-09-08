import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateHelper } from './common/date.helper';
import { UserModule } from './user.module/user.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
