import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeModule } from 'nestjs-stripe';
import { LinkModule } from '../link/link.module';
import { ProductModule } from '../product/product.module';
import { SharedModule } from '../shared/shared.module';
import { OrderListener } from './listeners/order.listener';
import { Order } from './order';
import { OrderItem } from './order-item';
import { OrderItemService } from './order-item.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    SharedModule,
    LinkModule,
    ProductModule,
    StripeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        apiKey: configService.get('STRIPE_KEY'),
        apiVersion: '2020-08-27'
      })
    }),
    MailerModule.forRoot({
      transport: {
        host: 'mailhog',
        port: 1025
      },
      defaults: {
        from: 'siios.contact@gmail.com'
      }
    })
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderItemService, OrderListener]
})
export class OrderModule {}
