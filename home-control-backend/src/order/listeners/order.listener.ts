import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { RedisService } from "src/shared/redis.service";
import { Order } from "../order";

@Injectable()
export class OrderListener {
    constructor(
        private redisService: RedisService,
        private mailerService: MailerService
    ) { 
    }

    @OnEvent('order.completed')
    async handleOrderCompletedEvent(order: Order) {
        const client = this.redisService.getClient();
        client.zincrby('rangings', order.ambassador_revenue, `${ order.first_name } ${ order.last_name }`/*order.user.name*/);

        await this.mailerService.sendMail({
            to: 'admin@admin.com',
            subject: 'An order has been completed',
            html: `Order #${order.id} with a total of ${order.total} has been completed!`
        });

        await this.mailerService.sendMail({
            to: order.ambassador_email,
            subject: 'An order has been completed',
            html: `You earned $${order.id} from the link #${order.code} has been completed!`
        })
    }
}