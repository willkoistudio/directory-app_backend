-- ============================================
-- SCHEMA SUPABASE POUR DIRECTORY APP
-- ============================================

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: companies
-- ============================================
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  fax VARCHAR(50),
  website VARCHAR(255),
  logo TEXT,
  area VARCHAR(255),
  street VARCHAR(255),
  city_id VARCHAR(100),
  postal_code VARCHAR(50),
  country_id VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: contacts
-- ============================================
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  work_phone VARCHAR(50),
  fax VARCHAR(50),
  function VARCHAR(255),
  website VARCHAR(255),
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  street VARCHAR(255),
  city_id VARCHAR(100),
  postal_code VARCHAR(50),
  country_id VARCHAR(100),
  keywords TEXT[] DEFAULT '{}',
  avatar TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES pour améliorer les performances
-- ============================================
CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);

-- ============================================
-- TRIGGER pour updated_at automatique
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Activez RLS si vous utilisez l'authentification Supabase
-- ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Exemple de politique (à adapter selon vos besoins) :
-- CREATE POLICY "Users can view all companies" ON companies
--   FOR SELECT USING (true);

-- CREATE POLICY "Users can view all contacts" ON contacts
--   FOR SELECT USING (true);

-- CREATE POLICY "Users can insert contacts" ON contacts
--   FOR INSERT WITH CHECK (true);

-- CREATE POLICY "Users can update contacts" ON contacts
--   FOR UPDATE USING (true);

-- CREATE POLICY "Users can delete contacts" ON contacts
--   FOR DELETE USING (true);

