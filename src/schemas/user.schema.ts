import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop()
  name: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ default: 'en-US' })
  language: string;

  // OAuth fields
  @Prop()
  provider?: string; // 'google', 'github', 'facebook', or undefined for email/password

  @Prop()
  providerId?: string; // ID from OAuth provider

  @Prop()
  picture?: string; // Profile picture URL
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add indexes
UserSchema.index({ email: 1 });
