insert into public.trails (
  title,
  region,
  difficulty,
  distance_km,
  elevation_gain_m,
  duration_hours,
  description,
  image_url,
  owner_id,
  created_at
)
select
  v.title,
  v.region,
  v.difficulty,
  v.distance_km::numeric(5, 1),
  v.elevation_gain_m::integer,
  v.duration_hours::numeric(4, 1),
  v.description,
  v.image_url,
  p.id,
  now() - make_interval(days => v.days_ago)
from public.profiles p
cross join (
  values
    (
      'Seven Rila Lakes from Rila Lakes hut',
      'Rila',
      'moderate',
      9,
      450,
      4,
      'Take the chairlift up from Panichishte and start walking at Rila Lakes hut. The path climbs gently past Bliznaka and the lower lakes, then gets steeper on the way up to Okoto and Salzata, where most of the lakes are in view at once. Go early on summer weekends, because both the chairlift and the trail get very busy by midday.',
      '/images/trails/seven-rila-lakes.jpg',
      8
    ),
    (
      'Musala peak from Borovets',
      'Rila',
      'hard',
      13,
      750,
      6,
      'Ride the Yastrebets gondola up from Borovets to skip most of the forest climb. From the top station the trail passes Musala hut and Ledenoto lake, then climbs the last rocky section to the summit at 2925 m, the highest peak in the Balkans. The weather changes quickly up there, so bring a warm layer even in August and check when the last gondola goes down.',
      '/images/trails/musala.jpg',
      7
    ),
    (
      'Cherni Vrah from Aleko',
      'Vitosha',
      'moderate',
      9,
      500,
      3.5,
      'Start at Aleko hut and follow the marked path over the open slopes to Cherni Vrah, the highest point of Vitosha. The climb is steady but never technical, and on a clear day you can see Sofia below you and Rila in the distance. The summit is often windy, so pack a jacket and gloves outside of summer.',
      '/images/trails/cherni-vrah.jpg',
      6
    ),
    (
      'Vihren from Vihren hut',
      'Pirin',
      'hard',
      9,
      1000,
      6,
      'Drive up the valley from Bansko to Vihren hut, where the trail begins. The first part is a long steady climb, but the last stretch below the summit is steep and rocky, so take your time and use your hands where needed. At 2914 m Vihren is the highest peak in Pirin. Start early and turn back if clouds start to build.',
      '/images/trails/vihren.jpg',
      5
    ),
    (
      'Boyana Waterfall',
      'Vitosha',
      'easy',
      6,
      400,
      2.5,
      'A popular half day hike from the Boyana district of Sofia up to the biggest waterfall on Vitosha. The path goes through the forest and is steep in a few places, with some rocky steps near the end. Spring is the best time to go, when there is plenty of water.',
      '/images/trails/boyana-waterfall.jpg',
      4
    ),
    (
      'Krushuna Falls loop',
      'Lovech region',
      'easy',
      2,
      80,
      1,
      'A short loop near the village of Krushuna, on wooden paths and small bridges past cascades and turquoise pools. It is easy enough for kids and makes a nice stop on a road trip through northern Bulgaria. Come in the morning on summer weekends if you want a quieter walk.',
      '/images/trails/krushuna-falls.jpg',
      3
    ),
    (
      'Trigrad Gorge and Devil''s Throat cave',
      'Rhodopes',
      'easy',
      4,
      150,
      1.5,
      'The road to Trigrad runs through a narrow marble gorge with walls a few hundred metres high. Park near the Devil''s Throat cave, walk the path along the river and look up at the cliffs, then go inside the cave to see the underground waterfall. Bring a jacket, the cave is cold even in the middle of summer.',
      '/images/trails/trigrad-gorge.jpg',
      2
    ),
    (
      'Botev peak via Rai hut',
      'Stara Planina',
      'hard',
      20,
      1500,
      10,
      'Start from Panitsite above Kalofer and climb through the Central Balkan National Park to Rai hut, right below Raysko Praskalo waterfall. From the hut a steep path leads up to the main ridge and on to Botev, at 2376 m the highest peak of Stara Planina. It is a long day, so many hikers sleep at Rai hut and go for the summit the next morning.',
      '/images/trails/botev-peak.jpg',
      1
    )
) as v (title, region, difficulty, distance_km, elevation_gain_m, duration_hours, description, image_url, days_ago)
where lower(p.username) = lower('your_username');
