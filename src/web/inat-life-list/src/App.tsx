import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LifeList from './components/LifeList.tsx';
import { BrowserRouter } from 'react-router-dom';
import { SettingsProvider } from './modules/settings/SettingsProvider.tsx';

function App() {
    const queryClient = new QueryClient();

    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <SettingsProvider>
                    <LifeList />
                </SettingsProvider>
            </QueryClientProvider>
        </BrowserRouter>
    );
}

export default App;
