import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotifyEmailDto } from './dto';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe())
  @EventPattern('notify_email')
  public async notifyEmail(
    @Payload() notifyEmailDto: NotifyEmailDto,
  ): Promise<void> {
    this.notificationsService.notifyEmail(notifyEmailDto);
  }
}
