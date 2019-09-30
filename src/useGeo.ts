
import { useState, useEffect } from 'preact/hooks';
import { EntryPosition } from 'store';

export function useGeo(mark?: EntryPosition) {
    const [state, set] = useState(mark);
    
    useEffect(() => void get(), [mark]);
    
    async function get() {
        await sleep(200);
        set(mark || await getGeo({ enableHighAccuracy: true }));
    }
    
    return state;
}

export async function sleep(timeout: number) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

async function getGeo(options?: PositionOptions) {
    return new Promise<EntryPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(geo => {
            const { latitude, longitude, altitude } = geo.coords;
            resolve({
                latitude,
                longitude,
                elevation: altitude || 0,
            });
        }, reject, options);
    });
}