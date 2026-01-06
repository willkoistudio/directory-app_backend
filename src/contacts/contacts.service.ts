import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createContactDto: CreateContactDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('contacts')
      .insert({
        name: createContactDto.name,
        email: createContactDto.email,
        phone: createContactDto.phone,
        work_phone: createContactDto.workPhone,
        fax: createContactDto.fax,
        function: createContactDto.function,
        website: createContactDto.website,
        company_id: createContactDto.companyId,
        street: createContactDto.address.street,
        city_id: createContactDto.address.cityId,
        postal_code: createContactDto.address.postalCode,
        country_id: createContactDto.address.countryId,
        keywords: createContactDto.keywords,
        avatar: createContactDto.avatar,
        notes: createContactDto.notes,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapToContactData(data);
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('contacts')
      .select(`
        *,
        companies (*)
      `);

    if (error) throw error;
    return data.map((contact) => this.mapToContact(contact));
  }

  async findOne(id: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('contacts')
      .select(`
        *,
        companies (*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return this.mapToContactData(data);
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    const supabase = this.supabaseService.getClient();

    const updateData: any = {};
    if (updateContactDto.name) updateData.name = updateContactDto.name;
    if (updateContactDto.email) updateData.email = updateContactDto.email;
    if (updateContactDto.phone) updateData.phone = updateContactDto.phone;
    if (updateContactDto.workPhone !== undefined) updateData.work_phone = updateContactDto.workPhone;
    if (updateContactDto.fax !== undefined) updateData.fax = updateContactDto.fax;
    if (updateContactDto.function) updateData.function = updateContactDto.function;
    if (updateContactDto.website) updateData.website = updateContactDto.website;
    if (updateContactDto.companyId) updateData.company_id = updateContactDto.companyId;
    if (updateContactDto.address) {
      updateData.street = updateContactDto.address.street;
      updateData.city_id = updateContactDto.address.cityId;
      updateData.postal_code = updateContactDto.address.postalCode;
      updateData.country_id = updateContactDto.address.countryId;
    }
    if (updateContactDto.keywords) updateData.keywords = updateContactDto.keywords;
    if (updateContactDto.avatar) updateData.avatar = updateContactDto.avatar;
    if (updateContactDto.notes !== undefined) updateData.notes = updateContactDto.notes;

    const { data, error } = await supabase
      .from('contacts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return this.mapToContactData(data);
  }

  async remove(id: string) {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Contact deleted successfully' };
  }

  async removeBatch(ids: string[]) {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase
      .from('contacts')
      .delete()
      .in('id', ids);

    if (error) throw error;
    return { message: 'Contacts deleted successfully' };
  }

  private mapToContact(contact: any) {
    return {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      workPhone: contact.work_phone,
      function: contact.function,
      companyId: contact.company_id,
      address: {
        street: contact.street,
        cityId: contact.city_id,
        postalCode: contact.postal_code,
        countryId: contact.country_id,
      },
      avatar: contact.avatar,
      createdAt: contact.created_at,
    };
  }

  private mapToContactData(contact: any) {
    const company = contact.companies || {};
    return {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      workPhone: contact.work_phone,
      fax: contact.fax,
      function: contact.function,
      website: contact.website,
      company: {
        id: company.id,
        name: company.name,
        phone: company.phone,
        area: company.area,
        logo: company.logo,
        address: {
          street: company.street,
          cityId: company.city_id,
          postalCode: company.postal_code,
          countryId: company.country_id,
        },
      },
      address: {
        street: contact.street,
        cityId: contact.city_id,
        postalCode: contact.postal_code,
        countryId: contact.country_id,
      },
      keywords: contact.keywords || [],
      avatar: contact.avatar,
      notes: contact.notes,
      createdAt: contact.created_at,
      updatedAt: contact.updated_at,
    };
  }
}

