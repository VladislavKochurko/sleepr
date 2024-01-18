import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';

import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { PaymentsCreateChargeDto } from './dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRETE_KEY'),
  );

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

  public async createCharge({
    card,
    amount,
    email,
  }: PaymentsCreateChargeDto): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    if (this.configService.get('DEV_MODE')) {
      this.notificationsService.emit('notify_email', { email });
      return await this.stripe.paymentIntents
        .create({
          amount: amount * 100,
          confirm: true,
          payment_method_types: ['card'],
          currency: 'usd',
          payment_method: 'pm_card_visa',
        })
        .then((response) => {
          this.notificationsService.emit('notify_email', {
            email,
            text: `Your payment of amount $${amount} has completed successfully`,
          });
          return response;
        });
    }

    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card,
    });

    return await this.stripe.paymentIntents
      .create({
        payment_method: paymentMethod.id,
        amount: amount * 100,
        confirm: true,
        payment_method_types: ['card'],
        currency: 'usd',
      })
      .then((response) => {
        this.notificationsService.emit('notify_email', {
          email,
          text: `Your payment of amount $${amount} has completed successfully`,
        });
        return response;
      });
  }
}
