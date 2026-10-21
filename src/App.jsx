import { Route, Routes } from 'react-router';

function Placeholder() {
  return (
    <main className="container page">
      <h1>Trailbook</h1>
      <p>Hiking trails shared by hikers. Work in progress.</p>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<Placeholder />} />
    </Routes>
  );
}
