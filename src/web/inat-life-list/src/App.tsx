import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LifeList from './modules/list/LifeList.tsx';
import { BrowserRouter } from 'react-router-dom';
import { SettingsProvider } from './modules/settings/SettingsProvider.tsx';
import SettingsSidebar from './modules/settings/SettingsSidebar.tsx';

function App() {
    const queryClient = new QueryClient();

    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <SettingsProvider>
                    <AppPage />
                </SettingsProvider>
            </QueryClientProvider>
        </BrowserRouter>
    );
}

const AppPage: React.FC = () => {
    return (
        <div style={{ display: 'flex' }}>
            <SettingsSidebar />

            <div
                style={{
                    minHeight: '100vh',
                    padding: '2rem',
                    width: '100%',
                }}
            >
                <h1
                    style={{
                        width: '100%',
                        textAlign: 'center',
                        color: 'rgb(1 81 79)',
                    }}
                >
                    iNaturalist Life List
                </h1>

                <div
                    style={{
                        // backgroundColor: 'white', // White block
                        // borderRadius: '8px',
                        // boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        padding: '2rem',
                        maxWidth: '60%',
                        margin: '0 auto',
                    }}
                >
                    <LifeList />
                </div>
            </div>
        </div>
    );
};

export default App;
