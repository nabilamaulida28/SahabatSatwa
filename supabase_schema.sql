-- =========================================================================
-- SAHABATSATWA - DATABASE SCHEMA & REALTIME SETUP (SUPABASE POSTGRESQL)
-- =========================================================================
-- Petunjuk Penggunaan:
-- 1. Buka dashboard Supabase Anda di https://supabase.com/dashboard
-- 2. Pilih project Anda, lalu buka menu "SQL Editor" di bilah kiri.
-- 3. Buat query baru (New Query), tempel (paste) seluruh isi file ini, lalu klik "RUN".
-- 4. Buka menu Project Settings -> API, salin "Project URL" dan "anon public key".
-- 5. Masukkan ke file .env (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY)
--    atau tempelkan langsung di aplikasi SahabatSatwa lewat tombol "Koneksi Supabase".
-- =========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 2. TABEL PROFIL PEMILIK (PROFILES)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Pemilik Hewan',
  email TEXT,
  phone TEXT DEFAULT '',
  city TEXT DEFAULT 'Jakarta',
  address TEXT DEFAULT '',
  bio TEXT DEFAULT 'Pecinta hewan peliharaan setia.',
  avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 3. TABEL DATA HEWAN (PETS)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.pets (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Kucing',
  breed TEXT DEFAULT '',
  gender TEXT DEFAULT 'Jantan',
  birth_date TEXT DEFAULT '',
  age_string TEXT DEFAULT '',
  current_weight NUMERIC DEFAULT 0,
  initial_weight NUMERIC DEFAULT 0,
  color TEXT DEFAULT '',
  photo TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  status_badge TEXT DEFAULT 'Perawatan Rutin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index user_id untuk performa kueri cepat
CREATE INDEX IF NOT EXISTS idx_pets_user_id ON public.pets(user_id);

-- =========================================================================
-- 4. TABEL JADWAL PERAWATAN (CARE_SCHEDULES)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.care_schedules (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Pemeriksaan',
  date TEXT NOT NULL,
  time TEXT DEFAULT '09:00',
  notes TEXT DEFAULT '',
  status TEXT DEFAULT 'Akan Datang',
  repeat TEXT DEFAULT 'Tidak berulang',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON public.care_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_pet_id ON public.care_schedules(pet_id);

-- =========================================================================
-- 5. TABEL RIWAYAT KESEHATAN (HEALTH_RECORDS)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.health_records (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id TEXT NOT NULL,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  symptoms TEXT DEFAULT '',
  diagnosis TEXT DEFAULT '',
  treatment TEXT DEFAULT '',
  medication TEXT DEFAULT '',
  vet_or_clinic TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_health_user_id ON public.health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_health_pet_id ON public.health_records(pet_id);

-- =========================================================================
-- 6. TABEL PENGINGAT (REMINDERS)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.reminders (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Obat Rutin',
  date TEXT NOT NULL,
  time TEXT DEFAULT '08:00',
  dosage_or_instruction TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  status TEXT DEFAULT 'Mendatang',
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_pet_id ON public.reminders(pet_id);

-- =========================================================================
-- 7. TABEL CATATAN PAKAN (FEEDING_RECORDS)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.feeding_records (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT DEFAULT '07:00',
  food_type TEXT NOT NULL DEFAULT 'Dry Food (Makanan Kering)',
  portion TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feeding_user_id ON public.feeding_records(user_id);
CREATE INDEX IF NOT EXISTS idx_feeding_pet_id ON public.feeding_records(pet_id);

-- =========================================================================
-- 8. TABEL CATATAN BERAT BADAN (WEIGHT_RECORDS)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.weight_records (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id TEXT NOT NULL,
  date TEXT NOT NULL,
  weight NUMERIC NOT NULL DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weight_user_id ON public.weight_records(user_id);
CREATE INDEX IF NOT EXISTS idx_weight_pet_id ON public.weight_records(pet_id);

-- =========================================================================
-- 9. ROW LEVEL SECURITY (RLS) - KEAMANAN DATA PENGGUNA
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feeding_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_records ENABLE ROW LEVEL SECURITY;

-- Profiles: pengguna hanya bisa membaca, mengubah, dan menambah profil milik sendiri
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Pets: pengguna hanya bisa akses hewannya sendiri
DROP POLICY IF EXISTS "Users can manage own pets" ON public.pets;
CREATE POLICY "Users can manage own pets" ON public.pets
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Care Schedules
DROP POLICY IF EXISTS "Users can manage own schedules" ON public.care_schedules;
CREATE POLICY "Users can manage own schedules" ON public.care_schedules
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Health Records
DROP POLICY IF EXISTS "Users can manage own health_records" ON public.health_records;
CREATE POLICY "Users can manage own health_records" ON public.health_records
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Reminders
DROP POLICY IF EXISTS "Users can manage own reminders" ON public.reminders;
CREATE POLICY "Users can manage own reminders" ON public.reminders
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Feeding Records
DROP POLICY IF EXISTS "Users can manage own feeding_records" ON public.feeding_records;
CREATE POLICY "Users can manage own feeding_records" ON public.feeding_records
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Weight Records
DROP POLICY IF EXISTS "Users can manage own weight_records" ON public.weight_records;
CREATE POLICY "Users can manage own weight_records" ON public.weight_records
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =========================================================================
-- 10. REALTIME PUBLICATION - SINKRONISASI INSTAN ANTAR PERANGKAT & TAB
-- =========================================================================
-- Pastikan tabel-tabel ini terdaftar dalam publikasi realtime Supabase
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'pets'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE 
      public.profiles, 
      public.pets, 
      public.care_schedules, 
      public.health_records, 
      public.reminders, 
      public.feeding_records, 
      public.weight_records;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Fallback jika sebagian tabel sudah ada
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles; EXCEPTION WHEN OTHERS THEN END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.pets; EXCEPTION WHEN OTHERS THEN END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.care_schedules; EXCEPTION WHEN OTHERS THEN END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.health_records; EXCEPTION WHEN OTHERS THEN END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.reminders; EXCEPTION WHEN OTHERS THEN END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.feeding_records; EXCEPTION WHEN OTHERS THEN END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.weight_records; EXCEPTION WHEN OTHERS THEN END;
END $$;

-- =========================================================================
-- 11. TRIGGER PENDAFTARAN PENGGUNA BARU OTOMATIS
-- =========================================================================
-- Saat user mendaftar lewat auth.signUp(), otomatis buat profil default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.email,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Selesai! Schema Supabase SahabatSatwa siap digunakan secara online dan realtime.
