-- =======================================================
-- e-njajan Database Schema for Supabase (PostgreSQL)
-- Salin dan jalankan skrip ini di SQL Editor dashboard Supabase
-- =======================================================

-- 1. Tabel Menu Kantin
create table if not exists public.menu (
  id text primary key,
  name text not null,
  description text not null,
  price integer not null,
  category text not null,
  stock integer not null default 0,
  daily_quota integer not null default 25,
  is_active boolean not null default true,
  image text not null,
  emoji text not null,
  is_popular boolean not null default false,
  created_at timestamptz default now()
);

-- 2. Tabel Pesanan (Orders)
create table if not exists public.orders (
  id text primary key,
  created_at timestamptz default now(),
  customer_name text not null,
  customer_role text not null default 'user',
  items jsonb not null,
  subtotal integer not null,
  delivery_fee integer not null default 0,
  total integer not null,
  fulfillment_method text not null check (fulfillment_method in ('pickup', 'delivery')),
  delivery_location text,
  order_status text not null check (order_status in ('menunggu_konfirmasi', 'sedang_disiapkan', 'siap_diambil', 'dalam_pengantaran', 'selesai', 'dibatalkan')),
  payment_method text not null check (payment_method in ('tunai', 'qris')),
  payment_status text not null check (payment_status in ('belum_dibayar', 'berhasil_disimulasikan', 'lunas', 'refund_disimulasikan')),
  payment_confirmed_at timestamptz,
  cancellation_reason text,
  is_demo_sample boolean default false
);

-- Indeks Kinerja untuk Pencarian & Filter Cepat Pesanan
create index if not exists idx_orders_customer on public.orders(customer_name);
create index if not exists idx_orders_status on public.orders(order_status);
create index if not exists idx_orders_created on public.orders(created_at desc);
create index if not exists idx_menu_category on public.menu(category);

-- 3. Tabel Pengaturan Kantin (Canteen Settings)
create table if not exists public.canteen_settings (
  id text primary key default 'default',
  canteen_name text not null default 'Kantin Sehat Nusantara',
  delivery_fee integer not null default 2000,
  is_service_active boolean not null default true,
  updated_at timestamptz default now()
);

-- 4. Aktifkan Row Level Security (RLS) & Kebijakan Akses Publik
alter table public.menu enable row level security;
alter table public.orders enable row level security;
alter table public.canteen_settings enable row level security;

-- Hapus kebijakan lama jika sudah ada
drop policy if exists "Allow all operations on menu" on public.menu;
drop policy if exists "Allow all operations on orders" on public.orders;
drop policy if exists "Allow all operations on canteen_settings" on public.canteen_settings;

-- Buat kebijakan baru agar aplikasi dapat membaca dan menulis
create policy "Allow all operations on menu" on public.menu for all using (true) with check (true);
create policy "Allow all operations on orders" on public.orders for all using (true) with check (true);
create policy "Allow all operations on canteen_settings" on public.canteen_settings for all using (true) with check (true);

-- 5. Aktifkan Supabase Realtime untuk tabel-tabel ini
-- (Akan menyiarkan event INSERT / UPDATE / DELETE langsung ke browser pelanggan & petugas)
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'orders') then
    alter publication supabase_realtime add table public.orders;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'menu') then
    alter publication supabase_realtime add table public.menu;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'canteen_settings') then
    alter publication supabase_realtime add table public.canteen_settings;
  end if;
end $$;

-- 6. Inisialisasi Pengaturan Bawaan
insert into public.canteen_settings (id, canteen_name, delivery_fee, is_service_active)
values ('default', 'Kantin Sehat Nusantara', 2000, true)
on conflict (id) do nothing;

-- 7. Seed 15 Menu Makanan & Minuman Awal
insert into public.menu (id, name, description, price, category, stock, is_active, emoji, image, is_popular)
values
  ('menu-1', 'Nasi Goreng Spesial Telur', 'Nasi goreng gurih dengan telur ceplok mata sapi, suwiran ayam, irisan acar segar, dan kerupuk renyah.', 13000, 'makanan_berat', 25, true, '🍳', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80', true),
  ('menu-2', 'Mie Ayam Bakso Pangsit', 'Mie kenyal dengan potongan ayam semur bumbu gurih, kuah kaldu hangat, 2 bakso sapi kenyal, dan pangsit renyah.', 12000, 'makanan_berat', 20, true, '🍜', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', true),
  ('menu-3', 'Ayam Geprek Sambal Bawang + Nasi', 'Ayam goreng tepung renyah yang digeprek dengan sambal bawang segar khas, disajikan hangat bersama nasi pulen.', 14000, 'makanan_berat', 18, true, '🍗', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80', true),
  ('menu-4', 'Soto Ayam Lamongan + Nasi', 'Kuah kuning hangat beraroma rempah dan koya gurih, suwiran ayam melimpah, tauge renyah, dan soun lembut.', 15000, 'makanan_berat', 15, true, '🍲', 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=600&q=80', false),
  ('menu-5', 'Siomay Ikan Kuah Kacang (Isi 5)', 'Siomay ikan tenggiri lembut berpadu bumbu kacang gurih kental, kecap manis, dan perasan jeruk limau segar.', 10000, 'camilan', 30, true, '🥟', 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80', true),
  ('menu-6', 'Batagor Renyah Bumbu Kacang', 'Bakso tahu goreng renyah keemasan disiram saus kacang gurih pedas manis yang menggugah selera saat istirahat.', 10000, 'camilan', 25, true, '🍢', 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80', false),
  ('menu-7', 'Tahu Bakso Goreng Hangat (Isi 4)', 'Tahu pong gurih padat berisi adonan bakso daging sapi kenyal, disajikan bersama cabai rawit hijau segar.', 8000, 'camilan', 35, true, '🧆', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', false),
  ('menu-8', 'Roti Bakar Cokelat Keju', 'Roti tebal bakar mentega wangi dengan taburan meses cokelat leleh dan limpahan parutan keju cheddar gurih.', 9000, 'camilan', 20, true, '🍞', 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?auto=format&fit=crop&w=600&q=80', false),
  ('menu-9', 'Pisang Goreng Keju Karamel', 'Pisang kepok manis berbalut tepung renyah, dipadu lelehan saus karamel dan taburan keju gurih hangat.', 8000, 'camilan', 20, true, '🍌', 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=600&q=80', false),
  ('menu-10', 'Es Teh Manis Segar', 'Seduhan daun teh melati pilihan yang harum, dipadukan gula tebu asli dan es batu melimpah pelepas dahaga.', 4000, 'minuman_dingin', 50, true, '🥤', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80', true),
  ('menu-11', 'Es Jeruk Peras Alami', 'Perasan jeruk segar asli kaya vitamin C dengan manis yang pas, sangat menyegarkan di terik siang hari sekolah.', 6000, 'minuman_dingin', 30, true, '🍊', 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80', false),
  ('menu-12', 'Jus Alpukat Cokelat Kental', 'Alpukat mentega matang lembut diblender kental dengan es batu dan swirl susu kental manis cokelat premium.', 10000, 'minuman_dingin', 15, true, '🥑', 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80', true),
  ('menu-13', 'Es Cincau Susu Gula Merah', 'Potongan cincau hitam kenyal alami disiram susu segar dan cairan gula merah aren legit khas nusantara.', 7000, 'minuman_dingin', 25, true, '🧋', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80', false),
  ('menu-14', 'Kopi Susu Gula Aren Hangat', 'Paduan espresso robusta harum dan susu segar lembut dengan manis alami gula aren yang menenangkan.', 7000, 'minuman_hangat', 25, true, '☕', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', false),
  ('menu-15', 'Teh Tarik Hangat Berbusa', 'Teh pekat harum dipadukan krimer kental manis yang ditarik hingga menghasilkan busa lembut di atasnya.', 6000, 'minuman_hangat', 20, true, '🍵', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', false)
on conflict (id) do nothing;
