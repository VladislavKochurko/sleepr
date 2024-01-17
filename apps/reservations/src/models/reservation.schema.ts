import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false })
export class ReservationDocument extends AbstractDocument {
  @Prop()
  public timestamp: Date;

  @Prop()
  public startDate: Date;

  @Prop()
  public endDate: Date;

  @Prop()
  public userId: string;

  @Prop()
  public invoiceId: string;
}

export const ReservationSchema =
  SchemaFactory.createForClass(ReservationDocument);
