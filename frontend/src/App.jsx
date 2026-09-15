import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Resume from './pages/Resume';
import CreateInterview from './pages/CreateInterview';
import Interview from './pages/Interview';
import Result from './pages/Result';
import History from './pages/History';
import JobAnalysis from './pages/JobAnalysis';
import NotFound from './pages/NotFound';
import Preview from './pages/Preview';
import Practice from './pages/Practice';
import CodingPractice from './pages/CodingPractice';
import AnalyticalPractice from './pages/AnalyticalPractice';
import Progress from './pages/Progress';
import Assistant from './pages/Assistant';

const secure = (Page) => <ProtectedRoute><Page /></ProtectedRoute>;

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={secure(Dashboard)} />
          <Route path="/profile" element={secure(Profile)} />
          <Route path="/resume" element={secure(Resume)} />
          <Route path="/interviews/new" element={secure(CreateInterview)} />
          <Route path="/practice" element={secure(Practice)} />
          <Route path="/practice/coding" element={secure(CodingPractice)} />
          <Route path="/practice/analytical" element={secure(AnalyticalPractice)} />
          <Route path="/progress" element={secure(Progress)} />
          <Route path="/ask" element={secure(Assistant)} />
          <Route path="/interviews/:id" element={secure(Interview)} />
          <Route path="/interviews/:id/result" element={secure(Result)} />
          <Route path="/history" element={secure(History)} />
          <Route path="/job-analysis" element={secure(JobAnalysis)} />
          <Route path="/settings" element={secure(Settings)} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
