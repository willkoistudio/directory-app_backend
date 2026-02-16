import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema({ timestamps: true })
export class Contact {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  workPhone: string;

  @Prop()
  fax: string;

  @Prop()
  function: string;

  @Prop()
  website: string;

  @Prop({ type: Types.ObjectId, ref: 'Company', default: null })
  companyId: Types.ObjectId;

  @Prop()
  street: string;

  @Prop()
  cityId: string;

  @Prop()
  postalCode: string;

  @Prop()
  stateId: string;

  @Prop()
  countryId: string;

  @Prop({ type: [String], default: [] })
  keywords: string[];

  @Prop()
  avatar: string;

  @Prop()
  notes: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

// Add indexes
ContactSchema.index({ companyId: 1 });
ContactSchema.index({ email: 1 });
