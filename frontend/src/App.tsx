import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Investigations } from './pages/Investigations';
import { InvestigationDetails } from './pages/InvestigationDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="investigations" element={<Investigations />} />
          <Route path="investigations/:id" element={<InvestigationDetails />} />
          <Route path="settings" element={<div style={{ padding: '2rem' }}>Settings Component</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
