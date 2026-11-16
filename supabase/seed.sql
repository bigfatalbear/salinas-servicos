insert into public.categories (name, slug, icon, sort_order) values
  ('Eletricista', 'eletricista', 'zap', 1),
  ('Manicure', 'manicure', 'sparkles', 2),
  ('Frete', 'frete', 'truck', 3),
  ('Pedreiro', 'pedreiro', 'hammer', 4),
  ('Pintor', 'pintor', 'paintbrush', 5),
  ('Salão de beleza', 'salao-de-beleza', 'scissors', 6),
  ('Mecânico', 'mecanico', 'car', 7),
  ('Diarista', 'diarista', 'home', 8),
  ('Cozinheira', 'cozinheira', 'chef-hat', 9),
  ('Fotógrafo', 'fotografo', 'camera', 10),
  ('Passeios', 'passeios', 'sailboat', 11),
  ('Mercados e mercearias', 'mercados-e-mercearias', 'shopping-basket', 12),
  ('Depósitos de bebidas', 'depositos-de-bebidas', 'wine', 13),
  ('Materiais de construção', 'materiais-de-construcao', 'brick-wall', 14),
  ('Venda de mariscos e peixes', 'venda-de-mariscos-e-peixes', 'fish', 15),
  ('Táxi e transporte', 'taxi-e-transporte', 'car-taxi-front', 16),
  ('Serviços de tecnologia', 'servicos-de-tecnologia', 'monitor-cog', 17),
  ('Locação de espaços para festas', 'locacao-de-espacos-para-festas', 'party-popper', 18),
  ('Outros serviços', 'outros-servicos', 'grid', 19)
on conflict (slug) do update set
  name = excluded.name,
  icon = excluded.icon,
  sort_order = excluded.sort_order;

insert into public.professionals (
  business_name, whatsapp, category_id, neighborhood, address, description,
  photo_1_url, is_featured, featured_order, recommendations, whatsapp_clicks
)
select
  'João Eletricista', '5571999990001', c.id, 'Centro',
  'Rua da Igreja, próximo à praça',
  'Instalações, quadros de energia, tomadas e reparos elétricos com atendimento rápido em toda a sede e nos distritos.',
  'images/demo/joao.svg', true, 1, 12, 34
from public.categories c
where c.slug = 'eletricista'
  and not exists (
    select 1 from public.professionals p
    where p.business_name = 'João Eletricista' and p.user_id is null
  );

insert into public.professionals (
  business_name, whatsapp, category_id, neighborhood, address, description,
  photo_1_url, is_featured, featured_order, recommendations, whatsapp_clicks
)
select
  'Márcia Manicure', '5571999990002', c.id, 'Encarnação',
  'Atendimento em domicílio e no salão',
  'Alongamento, esmaltação em gel, spa dos pés e unhas artísticas. Atendo com hora marcada de segunda a sábado.',
  'images/demo/marcia.svg', true, 2, 18, 41
from public.categories c
where c.slug = 'manicure'
  and not exists (
    select 1 from public.professionals p
    where p.business_name = 'Márcia Manicure' and p.user_id is null
  );

insert into public.professionals (
  business_name, whatsapp, category_id, neighborhood, address, description,
  photo_1_url, is_featured, featured_order, recommendations, whatsapp_clicks
)
select
  'Transporte do Nê', '5571999990003', c.id, 'Sede',
  'Fretes para Salvador, Feira e cidades vizinhas',
  'Fretes, mudanças e transporte de compras. Veículo fechado e atendimento combinado pelo WhatsApp.',
  'images/demo/ne.svg', false, 0, 7, 22
from public.categories c
where c.slug = 'frete'
  and not exists (
    select 1 from public.professionals p
    where p.business_name = 'Transporte do Nê' and p.user_id is null
  );

insert into public.professionals (
  business_name, whatsapp, category_id, neighborhood, address, description,
  photo_1_url, is_featured, featured_order, recommendations, whatsapp_clicks
)
select
  'Dona Lia Diarista', '5571999990004', c.id, 'Conceição de Salinas',
  'Atendimento na sede e na ilha',
  'Limpeza residencial, organização de casa e cuidado com roupa. Trabalho com referências na comunidade.',
  'images/demo/lia.svg', false, 0, 9, 15
from public.categories c
where c.slug = 'diarista'
  and not exists (
    select 1 from public.professionals p
    where p.business_name = 'Dona Lia Diarista' and p.user_id is null
  );

insert into public.professionals (
  business_name, whatsapp, category_id, neighborhood, address, description,
  photo_1_url, is_featured, featured_order, recommendations, whatsapp_clicks
)
select
  'Seu Antônio Pedreiro', '5571999990005', c.id, 'Cairu',
  'Obras e reformas na região',
  'Alvenaria, reboco, telhado e pequenas reformas. Orçamento sem compromisso e trabalho com equipe local.',
  'images/demo/antonio.svg', false, 0, 5, 11
from public.categories c
where c.slug = 'pedreiro'
  and not exists (
    select 1 from public.professionals p
    where p.business_name = 'Seu Antônio Pedreiro' and p.user_id is null
  );

insert into public.professionals (
  business_name, whatsapp, category_id, neighborhood, address, description,
  photo_1_url, is_featured, featured_order, recommendations, whatsapp_clicks
)
select
  'Ateliê Bella', '5571999990006', c.id, 'Dendê',
  'Rua principal do Dendê',
  'Cortes, escova, coloração e penteados para festas. Um espaço acolhedor para cuidar de você.',
  'images/demo/bella.svg', false, 0, 14, 28
from public.categories c
where c.slug = 'salao-de-beleza'
  and not exists (
    select 1 from public.professionals p
    where p.business_name = 'Ateliê Bella' and p.user_id is null
  );
