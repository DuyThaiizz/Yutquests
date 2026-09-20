-- Apply only to a dedicated Supabase project after review.
-- Browser clients use their own JWT; there is no service-role client in the app.
begin;
create table public.hanmori_tenants (
  id uuid primary key default gen_random_uuid(), name text not null check (char_length(name) between 1 and 120),
  timezone text not null default 'Asia/Ho_Chi_Minh', created_at timestamptz not null default now()
);
create table public.hanmori_memberships (
  tenant_id uuid not null references public.hanmori_tenants(id),
  user_id uuid not null references auth.users(id),
  role text not null check (role in ('student','teacher','admin')),
  active boolean not null default true, primary key (tenant_id,user_id)
);
create index on public.hanmori_memberships(user_id,active);
create function public.hanmori_role(target_tenant uuid) returns text language sql stable security definer set search_path = '' as $$
  select role from public.hanmori_memberships where tenant_id=target_tenant and user_id=auth.uid() and active=true
$$;
revoke all on function public.hanmori_role(uuid) from public;
grant execute on function public.hanmori_role(uuid) to authenticated;

create table public.hanmori_classes (
  tenant_id uuid not null references public.hanmori_tenants(id), id uuid not null default gen_random_uuid(),
  name text not null, primary key(tenant_id,id)
);
create table public.hanmori_class_members (
  tenant_id uuid not null, class_id uuid not null, user_id uuid not null,
  primary key(tenant_id,class_id,user_id),
  foreign key(tenant_id,class_id) references public.hanmori_classes(tenant_id,id),
  foreign key(tenant_id,user_id) references public.hanmori_memberships(tenant_id,user_id)
);
create table public.hanmori_lessons (
  tenant_id uuid not null references public.hanmori_tenants(id), id text not null,
  title text not null check(char_length(title) between 1 and 150), level integer not null check(level between 1 and 6),
  primary key(tenant_id,id)
);
create table public.hanmori_vocabulary (
  tenant_id uuid not null, id uuid not null default gen_random_uuid(), lesson_id text not null,
  korean text not null check(char_length(korean) between 1 and 100),
  meaning text not null check(char_length(meaning) between 1 and 300),
  example text not null default '' check(char_length(example)<=500), translation text not null default '' check(char_length(translation)<=500),
  romanization text not null default '' check(char_length(romanization)<=150), word_type text not null default '',
  source_page integer check(source_page between 1 and 30),
  status text not null default 'draft' check(status in ('draft','published','archived')),
  reviewed_by uuid references auth.users(id), updated_at timestamptz not null default now(),
  primary key(tenant_id,id), foreign key(tenant_id,lesson_id) references public.hanmori_lessons(tenant_id,id),
  check(status<>'published' or reviewed_by is not null)
);
create table public.hanmori_review_events (
  tenant_id uuid not null, user_id uuid not null, request_id uuid not null,
  word_id uuid not null, grade text not null check(grade in ('again','hard','good','easy')),
  created_at timestamptz not null default now(),
  primary key(tenant_id,user_id,request_id),
  foreign key(tenant_id,user_id) references public.hanmori_memberships(tenant_id,user_id),
  foreign key(tenant_id,word_id) references public.hanmori_vocabulary(tenant_id,id)
);
create table public.hanmori_extraction_usage (
  tenant_id uuid not null references public.hanmori_tenants(id), usage_day date not null,
  attempts integer not null default 0 check(attempts between 0 and 10), primary key(tenant_id,usage_day)
);
create table public.hanmori_audit_log (
  id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.hanmori_tenants(id),
  actor_id uuid references auth.users(id), word_id uuid not null, action text not null,
  created_at timestamptz not null default now()
);

alter table public.hanmori_tenants enable row level security;
alter table public.hanmori_memberships enable row level security;
alter table public.hanmori_classes enable row level security;
alter table public.hanmori_class_members enable row level security;
alter table public.hanmori_lessons enable row level security;
alter table public.hanmori_vocabulary enable row level security;
alter table public.hanmori_review_events enable row level security;
alter table public.hanmori_extraction_usage enable row level security;
alter table public.hanmori_audit_log enable row level security;

create policy tenant_read on public.hanmori_tenants for select to authenticated using(public.hanmori_role(id) is not null);
create policy membership_read on public.hanmori_memberships for select to authenticated using(user_id=auth.uid() or public.hanmori_role(tenant_id)='admin');
-- Membership creation/promotion is intentionally reserved for an audited provisioning process.
create policy class_read on public.hanmori_classes for select to authenticated using(public.hanmori_role(tenant_id) is not null);
create policy class_admin on public.hanmori_classes for all to authenticated using(public.hanmori_role(tenant_id)='admin') with check(public.hanmori_role(tenant_id)='admin');
create policy class_member_read on public.hanmori_class_members for select to authenticated using(user_id=auth.uid() or public.hanmori_role(tenant_id) in ('teacher','admin'));
create policy class_member_admin on public.hanmori_class_members for all to authenticated using(public.hanmori_role(tenant_id)='admin') with check(public.hanmori_role(tenant_id)='admin');
create policy lesson_read on public.hanmori_lessons for select to authenticated using(public.hanmori_role(tenant_id) is not null);
create policy lesson_write on public.hanmori_lessons for all to authenticated using(public.hanmori_role(tenant_id) in ('teacher','admin')) with check(public.hanmori_role(tenant_id) in ('teacher','admin'));
create policy vocabulary_read on public.hanmori_vocabulary for select to authenticated using(public.hanmori_role(tenant_id) in ('teacher','admin') or (public.hanmori_role(tenant_id)='student' and status='published'));
create policy vocabulary_insert on public.hanmori_vocabulary for insert to authenticated with check(public.hanmori_role(tenant_id) in ('teacher','admin') and status='draft' and reviewed_by is null);
create policy vocabulary_update on public.hanmori_vocabulary for update to authenticated using(public.hanmori_role(tenant_id) in ('teacher','admin')) with check(public.hanmori_role(tenant_id)='admin' or (public.hanmori_role(tenant_id)='teacher' and status='draft' and reviewed_by is null));
create policy review_read on public.hanmori_review_events for select to authenticated using(user_id=auth.uid() and public.hanmori_role(tenant_id) is not null);
create policy review_insert on public.hanmori_review_events for insert to authenticated with check(user_id=auth.uid() and public.hanmori_role(tenant_id) is not null and exists(select 1 from public.hanmori_vocabulary v where v.tenant_id=hanmori_review_events.tenant_id and v.id=word_id and v.status='published'));
create policy usage_read on public.hanmori_extraction_usage for select to authenticated using(public.hanmori_role(tenant_id) in ('teacher','admin'));
create policy audit_read on public.hanmori_audit_log for select to authenticated using(public.hanmori_role(tenant_id)='admin');

create function public.hanmori_content_audit() returns trigger language plpgsql security definer set search_path='' as $$
begin
  if new.tenant_id is distinct from old.tenant_id or new.id is distinct from old.id then
    raise exception 'Content identity cannot be changed';
  end if;
  if new.status='published' then
    if public.hanmori_role(new.tenant_id)<>'admin' then raise exception 'Only center admins can publish'; end if;
    new.reviewed_by=auth.uid();
  else new.reviewed_by=null;
  end if;
  new.updated_at=now();
  insert into public.hanmori_audit_log(tenant_id,actor_id,word_id,action) values(new.tenant_id,auth.uid(),new.id,new.status);
  return new;
end
$$;
create trigger vocabulary_audit before update on public.hanmori_vocabulary for each row execute function public.hanmori_content_audit();
revoke all on function public.hanmori_content_audit() from public;

create function public.hanmori_reserve_extraction(target_tenant uuid) returns boolean language plpgsql security definer set search_path='' as $$
declare used integer;
begin
  if coalesce(public.hanmori_role(target_tenant),'') not in ('teacher','admin') then raise exception 'Teacher role required' using errcode='42501'; end if;
  insert into public.hanmori_extraction_usage(tenant_id,usage_day,attempts)
    values(target_tenant,(now() at time zone 'Asia/Ho_Chi_Minh')::date,1)
    on conflict(tenant_id,usage_day) do update set attempts=public.hanmori_extraction_usage.attempts+1
    where public.hanmori_extraction_usage.attempts<10 returning attempts into used;
  return used is not null;
end
$$;
revoke all on function public.hanmori_reserve_extraction(uuid) from public;
grant execute on function public.hanmori_reserve_extraction(uuid) to authenticated;
grant usage on schema public to authenticated;
grant select on public.hanmori_tenants,public.hanmori_memberships,public.hanmori_extraction_usage,public.hanmori_audit_log to authenticated;
grant select,insert,update,delete on public.hanmori_classes,public.hanmori_class_members,public.hanmori_lessons to authenticated;
grant select,insert,update on public.hanmori_vocabulary to authenticated;
grant select,insert on public.hanmori_review_events to authenticated;
commit;
