import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import PageHeader from '../components/PageHeader';

export default function HistoryPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F4F1EA' }}>
      <PageHeader title="내 지갑" onBack={() => navigate(-1)} />

      <div className="flex-1" />
      <BottomNav />
    </div>
  );
}
