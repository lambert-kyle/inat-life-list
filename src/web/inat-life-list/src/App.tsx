import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LifeList from './modules/list/LifeList.tsx';
import { BrowserRouter } from 'react-router-dom';
import { SettingsProvider } from './modules/settings/SettingsProvider.tsx';
import SettingsSidebar from './modules/settings/SettingsSidebar.tsx';
import { useSettings } from './modules/settings/useSettings.tsx';
import usePlace from './modules/settings/place/usePlace.ts';
import useUser from './modules/settings/user/useUser.ts';

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
    const { limit, radiusKm, placeId, userId } = useSettings();
    const { data: place } = usePlace(placeId);
    const { data: user } = useUser(userId);

    const [isOpen, setIsOpen] = React.useState(false);

    const SettingValue: React.FC<{ children: React.ReactNode }> = ({
        children,
    }) => (
        <span
            style={{
                color: '#5a9bd4', // Muted blue
                cursor: 'pointer',
                textDecoration: 'none', // No underline by default
            }}
            onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = 'underline')
            }
            onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = 'none')
            }
            onClick={() => setIsOpen(true)} // Open the settings modal
        >
            {children}
        </span>
    );

    return (
        <div style={{ display: 'flex' }}>
            <SettingsSidebar setIsOpen={setIsOpen} isOpen={isOpen} />

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
                <h2
                    style={{
                        width: '100%',
                        textAlign: 'center',
                    }}
                >
                    Showing the <SettingValue>{limit}</SettingValue> most
                    observed taxa within <SettingValue>{radiusKm}</SettingValue>{' '}
                    km of <SettingValue>{place?.display_name}</SettingValue>
                </h2>
                <h3
                    style={{
                        width: '100%',
                        textAlign: 'center',
                    }}
                >
                    <SettingValue>{user?.login}</SettingValue> has observed # of
                    the <SettingValue>{limit}</SettingValue>
                </h3>

                <div
                    style={{
                        maxWidth: '75%',
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
