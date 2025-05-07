import React, { SetStateAction } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LifeList, { Species } from './modules/list/LifeList.tsx';
import { BrowserRouter } from 'react-router-dom';
import { SettingsProvider } from './modules/settings/SettingsProvider.tsx';
import SettingsSidebar from './modules/settings/SettingsSidebar.tsx';
import { useSettings } from './modules/settings/useSettings.tsx';
import usePlace from './modules/settings/place/usePlace.ts';
import useUser from './modules/settings/user/useUser.ts';
import { useTopSpecies } from './modules/observations/useTopSpecies.ts';
import { useUserObservations } from './modules/observations/useUserObservations.ts';
import Hamburger from 'hamburger-react';

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

const SettingValue: React.FC<{
    children: React.ReactNode;
    setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}> = ({ children, setIsOpen }) => (
    <span
        style={{
            color: '#5a9bd4', // Muted blue
            cursor: 'pointer',
            textDecoration: 'none', // No underline by default
            fontWeight: 'bold',
        }}
        onMouseEnter={(e) =>
            (e.currentTarget.style.textDecoration = 'underline')
        }
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
        onClick={() => setIsOpen(true)} // Open the settings modal
    >
        {children}
    </span>
);

const AppPage: React.FC = () => {
    const { latitude, limit, longitude, radiusKm, userId, placeId } =
        useSettings();

    const { data: place } = usePlace(placeId);
    const { data: user } = useUser(userId);

    const {
        data: topSpecies,
        error: topSpeciesError,
        isLoading: topSpeciesLoading,
    } = useTopSpecies({
        lat: latitude,
        lng: longitude,
        radius: radiusKm,
        limit,
    });

    const {
        data: userTaxa,
        error: userObservationsError,
        isLoading: userObservationsLoading,
    } = useUserObservations(userId);

    const isLoading = topSpeciesLoading || userObservationsLoading;

    const speciesList: Species[] = React.useMemo(() => {
        if (!topSpecies) return [];
        return topSpecies.map(
            (species): Species => ({
                id: species.id,
                scientificName: species.name,
                commonName: species.preferred_common_name,
                observationsCount: species.observations_count,
                photoUrl: species.default_photo?.square_url,
                seen: userTaxa?.has(species.id) ?? false,
                iNatLink: `https://www.inaturalist.org/taxa/${species.id}`,
                iconicTaxonId: species.iconic_taxon_id,
            })
        );
    }, [topSpecies, userTaxa]);

    const numberSeen = React.useMemo(
        () => speciesList.filter((x) => x.seen).length,
        [speciesList]
    );

    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div>
            <header
                style={{
                    width: '100%',
                    backgroundColor: 'rgb(1 81 79)', // Banner background color
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0rem',
                    position: 'relative',
                    top: 0,
                    zIndex: 998,
                }}
            >
                {/* Centered Title */}
                <h1
                    style={{
                        margin: 0,
                        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', // Responsive font size
                        textAlign: 'center',
                        flex: 1,
                    }}
                >
                    iNaturalist Life List
                </h1>
            </header>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '100vh',
                    marginTop: '1rem',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <SettingsSidebar setIsOpen={setIsOpen} isOpen={isOpen} />

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '95%',
                            alignItems: 'center',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                textAlign: 'center',
                                fontSize: 'clamp(1.1rem, 2.5vw, 1.2rem)',
                                gap: '0.25em',
                                marginBottom: '1rem',
                                flexWrap: 'wrap',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                <SettingValue setIsOpen={setIsOpen}>
                                    {user?.login}
                                </SettingValue>
                            </div>
                            has observed
                            <span
                                style={{
                                    fontWeight: 'bold',
                                    color: '#4caf50',
                                }}
                            >
                                {numberSeen}
                            </span>
                            of the
                            <SettingValue setIsOpen={setIsOpen}>
                                {limit}
                            </SettingValue>{' '}
                            most observed species within{' '}
                            <SettingValue setIsOpen={setIsOpen}>
                                {radiusKm}
                            </SettingValue>{' '}
                            km of{' '}
                            <SettingValue setIsOpen={setIsOpen}>
                                {place?.display_name}
                            </SettingValue>
                        </div>

                        <div
                            style={{
                                margin: '0 auto',
                            }}
                        >
                            {isLoading && <p>Loading...</p>}
                            {topSpeciesError && (
                                <p>
                                    Error loading top species:{' '}
                                    {topSpeciesError.message}
                                </p>
                            )}
                            {userObservationsError && (
                                <p>
                                    Error loading user observations:{' '}
                                    {userObservationsError.message}
                                </p>
                            )}
                            <LifeList speciesList={speciesList} />
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        color: '#555',
                    }}
                >
                    <p style={{ marginBottom: '-1em' }}>
                        Made by{' '}
                        <a
                            href="https://github.com/lambert-kyle"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#007bff', textDecoration: 'none' }}
                        >
                            Kyle Lambert
                        </a>
                    </p>
                    <p>
                        View the project on{' '}
                        <a
                            href="https://github.com/lambert-kyle/inat-life-list"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#007bff', textDecoration: 'none' }}
                        >
                            GitHub
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default App;
