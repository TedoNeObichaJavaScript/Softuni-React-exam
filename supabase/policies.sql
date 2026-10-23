revoke all on public.profiles, public.trails, public.comments, public.likes from anon, authenticated;

grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.trails, public.comments, public.likes to anon, authenticated;
grant insert, delete on public.trails to authenticated;
grant update (title, region, difficulty, distance_km, elevation_gain_m, duration_hours, description, image_url)
  on public.trails to authenticated;
grant insert, delete on public.comments, public.likes to authenticated;

drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles
  for select to anon, authenticated
  using (true);

drop policy if exists trails_read on public.trails;
create policy trails_read on public.trails
  for select to anon, authenticated
  using (true);

drop policy if exists trails_create on public.trails;
create policy trails_create on public.trails
  for insert to authenticated
  with check (owner_id = (select auth.uid()));

drop policy if exists trails_update on public.trails;
create policy trails_update on public.trails
  for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

drop policy if exists trails_delete on public.trails;
create policy trails_delete on public.trails
  for delete to authenticated
  using (owner_id = (select auth.uid()));

drop policy if exists comments_read on public.comments;
create policy comments_read on public.comments
  for select to anon, authenticated
  using (true);

drop policy if exists comments_create on public.comments;
create policy comments_create on public.comments
  for insert to authenticated
  with check (
    owner_id = (select auth.uid())
    and char_length(trim(body)) between 1 and 500
  );

drop policy if exists comments_delete on public.comments;
create policy comments_delete on public.comments
  for delete to authenticated
  using (owner_id = (select auth.uid()));

drop policy if exists likes_read on public.likes;
create policy likes_read on public.likes
  for select to anon, authenticated
  using (true);

drop policy if exists likes_create on public.likes;
create policy likes_create on public.likes
  for insert to authenticated
  with check (
    owner_id = (select auth.uid())
    and not exists (
      select 1
      from public.trails t
      where t.id = likes.trail_id
        and t.owner_id = (select auth.uid())
    )
  );

drop policy if exists likes_delete on public.likes;
create policy likes_delete on public.likes
  for delete to authenticated
  using (owner_id = (select auth.uid()));
