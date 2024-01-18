import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe())
  async createCharge(
    @Payload() paymentsCreateChargeDto: PaymentsCreateChargeDto,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return this.paymentsService.createCharge(paymentsCreateChargeDto);
  }
}
