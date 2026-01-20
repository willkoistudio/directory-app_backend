import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from '../schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
  ) {}

  async create(createContactDto: CreateContactDto) {
    const contact = new this.contactModel({
      name: createContactDto.name,
      email: createContactDto.email,
      phone: createContactDto.phone,
      workPhone: createContactDto.workPhone,
      fax: createContactDto.fax,
      function: createContactDto.function,
      website: createContactDto.website,
      companyId: createContactDto.companyId,
      street: createContactDto.address.street,
      cityId: createContactDto.address.cityId,
      postalCode: createContactDto.address.postalCode,
      countryId: createContactDto.address.countryId,
      keywords: createContactDto.keywords,
      avatar: createContactDto.avatar,
      notes: createContactDto.notes,
    });

    const savedContact = await contact.save();
    return this.mapToContactData(savedContact);
  }

  async findAll() {
    const contacts = await this.contactModel
      .find()
      .populate('companyId')
      .exec();
    return contacts.map((contact) => this.mapToContact(contact));
  }

  async findOne(id: string) {
    const contact = await this.contactModel
      .findById(id)
      .populate('companyId')
      .exec();

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return this.mapToContactData(contact);
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    const updateData: any = {};
    if (updateContactDto.name) updateData.name = updateContactDto.name;
    if (updateContactDto.email) updateData.email = updateContactDto.email;
    if (updateContactDto.phone) updateData.phone = updateContactDto.phone;
    if (updateContactDto.workPhone !== undefined)
      updateData.workPhone = updateContactDto.workPhone;
    if (updateContactDto.fax !== undefined) updateData.fax = updateContactDto.fax;
    if (updateContactDto.function)
      updateData.function = updateContactDto.function;
    if (updateContactDto.website) updateData.website = updateContactDto.website;
    if (updateContactDto.companyId)
      updateData.companyId = updateContactDto.companyId;
    if (updateContactDto.address) {
      updateData.street = updateContactDto.address.street;
      updateData.cityId = updateContactDto.address.cityId;
      updateData.postalCode = updateContactDto.address.postalCode;
      updateData.countryId = updateContactDto.address.countryId;
    }
    if (updateContactDto.keywords)
      updateData.keywords = updateContactDto.keywords;
    if (updateContactDto.avatar) updateData.avatar = updateContactDto.avatar;
    if (updateContactDto.notes !== undefined)
      updateData.notes = updateContactDto.notes;

    const contact = await this.contactModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('companyId')
      .exec();

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return this.mapToContactData(contact);
  }

  async remove(id: string) {
    const result = await this.contactModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return { message: 'Contact deleted successfully' };
  }

  async removeBatch(ids: string[]) {
    const result = await this.contactModel
      .deleteMany({ _id: { $in: ids } })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('No contacts found to delete');
    }

    return { message: 'Contacts deleted successfully' };
  }

  private mapToContact(contact: any) {
    return {
      id: contact._id.toString(),
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      workPhone: contact.workPhone,
      function: contact.function,
      companyId: contact.companyId?._id?.toString() || contact.companyId,
      address: {
        street: contact.street,
        cityId: contact.cityId,
        postalCode: contact.postalCode,
        countryId: contact.countryId,
      },
      avatar: contact.avatar,
      createdAt: contact.createdAt,
    };
  }

  private mapToContactData(contact: any) {
    const company = contact.companyId || {};
    return {
      id: contact._id.toString(),
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      workPhone: contact.workPhone,
      fax: contact.fax,
      function: contact.function,
      website: contact.website,
      company: company._id
        ? {
            id: company._id.toString(),
            name: company.name,
            phone: company.phone,
            area: company.area,
            logo: company.logo,
            address: {
              street: company.street,
              cityId: company.cityId,
              postalCode: company.postalCode,
              countryId: company.countryId,
            },
          }
        : null,
      address: {
        street: contact.street,
        cityId: contact.cityId,
        postalCode: contact.postalCode,
        countryId: contact.countryId,
      },
      keywords: contact.keywords || [],
      avatar: contact.avatar,
      notes: contact.notes,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    };
  }
}

