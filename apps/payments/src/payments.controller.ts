import { CreateChargeDto } from '@app/common';
import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe())
  async createCharge(
    @Payload() createChargeDto: CreateChargeDto,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return this.paymentsService.createCharge(createChargeDto);
  }
}
