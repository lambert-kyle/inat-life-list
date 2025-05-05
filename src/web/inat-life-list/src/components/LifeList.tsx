import React, { useState } from 'react';
import { useTopSpecies } from '../hooks/useTopSpecies.ts';
import SettingsModal from '../modules/settings/SettingsModal.tsx';
import { useSettings } from '../modules/settings/useSettings.tsx';
import { useUserObservations } from '../modules/observations/useUserObservations.ts';
import useUser from '../modules/settings/user/useUser.ts';

export const LifeList = (): React.ReactElement => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { latitude, limit, longitude, radiusKm, userId } = useSettings();

    const {
        data: topSpecies,
        error,
        isLoading,
    } = useTopSpecies({
        lat: latitude,
        lng: longitude,
        radius: radiusKm,
        limit,
    });

    const { data: userTaxa } = useUserObservations(userId);

    React.useEffect(() => {
        console.log({ latitude, limit, longitude, radiusKm, userId });
    }, [latitude, limit, longitude, radiusKm, userId]);
    const { data: user } = useUser(userId);

    const results = React.useMemo(
        () =>
            topSpecies?.map((species) => ({
                id: species.id,
                scientificName: species.name,
                commonName: species.preferred_common_name,
                observationsCount: species.observations_count,
                photoUrl: species.default_photo?.square_url,
                seen: userTaxa?.has(species.id),
            })),
        [topSpecies, userTaxa]
    );

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <h1>iNaturalist Life List</h1>
                <button
                    onClick={() => setSettingsOpen(true)}
                    title="Settings"
                    style={{ fontSize: 'large' }}
                >
                    ⚙️
                </button>
            </div>
            <span>
                Showing top {limit} species within {radiusKm} km of (
                {latitude?.toFixed(2)}, {longitude?.toFixed(2)}) and whether{' '}
                {user?.login} has observed them
            </span>

            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {topSpecies && (
                <table>
                    <thead>
                        <tr>
                            <th>📸</th>
                            <th>Scientific Name</th>
                            <th>Common Name</th>
                            <th>Observation Count</th>
                            <th>Seen?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results?.map((species) => (
                            <tr key={species.id}>
                                <td>
                                    {species.photoUrl ? (
                                        <img
                                            src={species.photoUrl}
                                            alt={
                                                species.commonName ||
                                                species.scientificName
                                            }
                                            width="50"
                                            height="50"
                                        />
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                                <td>
                                    <i>{species.scientificName}</i>
                                </td>
                                <td>{species.commonName || 'N/A'}</td>
                                <td>{species.observationsCount}</td>
                                <td>
                                    {species.seen ? '✅ Seen' : '❌ Not Seen'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <SettingsModal
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
            />
        </div>
    );
};

export default LifeList;
