import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Stripe from 'stripe';
import { CreateChargeDto } from '@app/common';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRETE_KEY'),
  );

  constructor(private readonly configService: ConfigService) {}

  public async createCharge({
    card,
    amount,
  }: CreateChargeDto): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    if (this.configService.get('DEV_MODE')) {
      return await this.stripe.paymentIntents.create({
        amount: amount * 100,
        confirm: true,
        payment_method_types: ['card'],
        currency: 'usd',
        payment_method: 'pm_card_visa',
      });
    }

    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card,
    });

    return await this.stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount: amount * 100,
      confirm: true,
      payment_method_types: ['card'],
      currency: 'usd',
    });
  }
}
