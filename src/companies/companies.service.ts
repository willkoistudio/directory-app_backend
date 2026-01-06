import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('companies')
      .insert({
        name: createCompanyDto.name,
        phone: createCompanyDto.phone,
        fax: createCompanyDto.fax,
        website: createCompanyDto.website,
        logo: createCompanyDto.logo,
        area: createCompanyDto.area,
        street: createCompanyDto.address.street,
        city_id: createCompanyDto.address.cityId,
        postal_code: createCompanyDto.address.postalCode,
        country_id: createCompanyDto.address.countryId,
        notes: createCompanyDto.notes,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapToCompanyData(data);
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.from('companies').select('*');

    if (error) throw error;
    return data.map((company) => this.mapToCompany(company));
  }

  async findOne(id: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return this.mapToCompanyData(data);
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const supabase = this.supabaseService.getClient();

    const updateData: any = {};
    if (updateCompanyDto.name) updateData.name = updateCompanyDto.name;
    if (updateCompanyDto.phone) updateData.phone = updateCompanyDto.phone;
    if (updateCompanyDto.fax !== undefined)
      updateData.fax = updateCompanyDto.fax;
    if (updateCompanyDto.website !== undefined)
      updateData.website = updateCompanyDto.website;
    if (updateCompanyDto.logo) updateData.logo = updateCompanyDto.logo;
    if (updateCompanyDto.area) updateData.area = updateCompanyDto.area;
    if (updateCompanyDto.address) {
      updateData.street = updateCompanyDto.address.street;
      updateData.city_id = updateCompanyDto.address.cityId;
      updateData.postal_code = updateCompanyDto.address.postalCode;
      updateData.country_id = updateCompanyDto.address.countryId;
    }
    if (updateCompanyDto.notes !== undefined)
      updateData.notes = updateCompanyDto.notes;

    const { data, error } = await supabase
      .from('companies')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return this.mapToCompanyData(data);
  }

  async remove(id: string) {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase.from('companies').delete().eq('id', id);

    if (error) throw error;
    return { message: 'Company deleted successfully' };
  }

  private mapToCompany(company: any) {
    return {
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
      createdAt: company.created_at,
    };
  }

  private mapToCompanyData(company: any) {
    return {
      id: company.id,
      name: company.name,
      phone: company.phone,
      fax: company.fax,
      website: company.website,
      logo: company.logo,
      area: company.area,
      address: {
        street: company.street,
        cityId: company.city_id,
        postalCode: company.postal_code,
        countryId: company.country_id,
      },
      notes: company.notes,
      createdAt: company.created_at,
      updatedAt: company.updated_at,
    };
  }
}
