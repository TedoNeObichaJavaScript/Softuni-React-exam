import { Link } from 'react-router';
import { Check, Phone, TriangleAlert } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import DifficultyBadge from '../../components/trails/DifficultyBadge';
import './About.css';

const GUEST_FEATURES = [
  'Browse and search every trail',
  'Filter by difficulty and sort by distance',
  'Read trail details and comments',
  'Look at hiker profiles',
];

const MEMBER_FEATURES = [
  'Add trails you have walked',
  'Edit or delete your own trails',
  'Like trails shared by other hikers',
  'Leave comments with tips or recent conditions',
];

const LEVELS = [
  {
    difficulty: 'easy',
    text: 'Short or mostly flat walks on clear, marked paths, usually under 400 m of climbing. Good for a first hike, for families and for slow days.',
  },
  {
    difficulty: 'moderate',
    text: 'A few hours on your feet with steady climbs of roughly 400 to 1000 m and some rocky or steep parts. You should be used to walking.',
  },
  {
    difficulty: 'hard',
    text: 'Long days with big climbs, often over 1000 m, exposed ridges or loose ground. For fit hikers with proper boots, layers and some experience.',
  },
];

const PHOTO_CREDITS = [
  {
    place: 'Seven Rila Lakes',
    fileUrl: 'https://commons.wikimedia.org/wiki/File:Pogled_kum_ezerata_ot_biloto.JPG',
    author: 'Senior maloney',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  {
    place: 'Musala',
    fileUrl: 'https://commons.wikimedia.org/wiki/File:Musala-celek.JPG',
    author: 'František Rochovanský (Rochovaf)',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  },
  {
    place: 'Cherni Vrah',
    fileUrl: 'https://commons.wikimedia.org/wiki/File:Cherni_Vrah_Vitosha_07.jpg',
    author: 'Иван',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    place: 'Vihren',
    fileUrl: 'https://commons.wikimedia.org/wiki/File:Vihren,_Pirin_National_Park_01.JPG',
    author: 'Спасимир',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    place: 'Boyana Waterfall',
    fileUrl: 'https://commons.wikimedia.org/wiki/File:Boyana_falls.jpg',
    author: 'Mrejorix',
    license: 'Public domain',
  },
  {
    place: 'Krushuna Falls',
    fileUrl: 'https://commons.wikimedia.org/wiki/File:Krushuna_waterfalls_061.jpg',
    author: 'Vislupus',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    place: 'Trigrad Gorge',
    fileUrl: 'https://commons.wikimedia.org/wiki/File:Trigrad_Gorge_1.jpg',
    author: 'Borislav krustev',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    place: 'Botev peak',
    fileUrl: 'https://commons.wikimedia.org/wiki/File:Below_Botev_peak.jpg',
    author: 'Derbeth',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
];

function FeatureList({ title, items }) {
  return (
    <div className="about-features">
      <h3 className="about-features-title">{title}</h3>
      <ul className="about-features-list">
        {items.map((item) => (
          <li key={item}>
            <Check size={16} strokeWidth={2} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function About() {
  useDocumentTitle('About');

  return (
    <div className="container page about">
      <header className="page-header">
        <h1>About Trailbook</h1>
        <p>A community guide to hiking trails, written by the people who walk them.</p>
      </header>

      <section className="about-section" aria-labelledby="about-what-title">
        <h2 id="about-what-title">What it is</h2>
        <p>
          Trailbook collects hiking routes from the Bulgarian mountains and a few places beyond.
          Every trail has its distance, elevation gain, rough walking time and a description from
          the hiker who added it, so you can pick a route that fits your day.
        </p>
        <div className="about-features-grid">
          <FeatureList title="Without an account you can" items={GUEST_FEATURES} />
          <FeatureList title="With an account you can also" items={MEMBER_FEATURES} />
        </div>
        <p className="about-cta">
          <Link to="/trails" className="btn btn-primary">Browse trails</Link>
        </p>
      </section>

      <section className="about-section" aria-labelledby="about-levels-title">
        <h2 id="about-levels-title">How difficulty works</h2>
        <p>
          Each trail gets one of three levels. The person who adds the trail picks it, so treat it
          as a rough guide and read the description too.
        </p>
        <ul className="about-levels">
          {LEVELS.map(({ difficulty, text }) => (
            <li key={difficulty} className="about-level">
              <DifficultyBadge difficulty={difficulty} />
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-section" aria-labelledby="about-safety-title">
        <h2 id="about-safety-title">Before you head out</h2>
        <div className="alert alert-warning">
          <TriangleAlert size={20} strokeWidth={2} aria-hidden="true" />
          <p>
            Trails on Trailbook are shared by users and the details can be out of date. Check the
            weather and current conditions before you go, tell someone your route and turn back
            if something does not feel right.
          </p>
        </div>
        <p className="about-emergency">
          <Phone size={16} strokeWidth={2} aria-hidden="true" />
          <span>
            In an emergency in Bulgaria call <strong>112</strong>. The operators also reach the
            Mountain Rescue Service.
          </span>
        </p>
      </section>

      <section className="about-section" aria-labelledby="about-credits-title">
        <h2 id="about-credits-title">Photo credits</h2>
        <p>The photos of the sample trails are from Wikimedia Commons.</p>
        <ul className="about-credits">
          {PHOTO_CREDITS.map(({ place, fileUrl, author, license, licenseUrl }) => (
            <li key={place} className="about-credit">
              <a className="about-credit-place" href={fileUrl} target="_blank" rel="noreferrer">
                {place}
              </a>
              <span className="about-credit-author">{author}</span>
              <span className="about-credit-license">
                {licenseUrl ? (
                  <a href={licenseUrl} target="_blank" rel="noreferrer">{license}</a>
                ) : (
                  license
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
