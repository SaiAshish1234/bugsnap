import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Analyze from './pages/Analyze';
import History from './pages/History';
import SharedView from './pages/SharedView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Analyze />} />
          <Route path="history" element={<History />} />
        </Route>
        <Route path="/share/:id" element={<SharedView />} />
      </Routes>
    </BrowserRouter>
  );
}