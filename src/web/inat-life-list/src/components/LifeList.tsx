import React, { useState } from 'react';
import { useTopSpecies } from '../hooks/useTopSpecies.ts';
import SettingsModal from '../modules/settings/SettingsModal.tsx';
import { useSettings } from '../modules/settings/useSettings.tsx';
import { useUserObservations } from '../modules/observations/useUserObservations.ts';

export const LifeList = (): React.ReactElement => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { latitude, limit, longitude, radiusKm, userId } = useSettings();

    const { data, error, isLoading } = useTopSpecies({
        lat: latitude,
        lng: longitude,
        radius: radiusKm,
        limit,
    });

    const { data: userTaxa } = useUserObservations(userId);

    React.useEffect(() => {
        console.log({ latitude, limit, longitude, radiusKm, userId });
    }, [latitude, limit, longitude, radiusKm, userId]);

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
                {latitude?.toFixed(2)}, {longitude?.toFixed(2)})
            </span>

            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && (
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
                        {data.map((species) => {
                            const seen = userTaxa?.has(species.id);

                            return (
                                <tr key={species.id}>
                                    <td>
                                        {species.default_photo?.square_url ? (
                                            <img
                                                src={
                                                    species.default_photo
                                                        .square_url
                                                }
                                                alt={
                                                    species.preferred_common_name ||
                                                    species.name
                                                }
                                                width="50"
                                                height="50"
                                            />
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td>
                                        <i>{species.name}</i>
                                    </td>
                                    <td>
                                        {species.preferred_common_name || 'N/A'}
                                    </td>
                                    <td>{species.observations_count}</td>
                                    <td>{seen ? '✅ Seen' : '❌ Not Seen'}</td>
                                </tr>
                            );
                        })}
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
