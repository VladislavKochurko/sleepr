import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  versionKey: false,
})
export class UserDocument extends AbstractDocument {
  @Prop()
  public email: string;

  @Prop()
  public password: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
