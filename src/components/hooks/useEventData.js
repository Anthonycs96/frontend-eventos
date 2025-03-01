import { useState, useEffect } from 'react';
import API from '@/utils/api';

export function useEventData(eventId, guestId) {
    const [invitado, setInvitado] = useState(null);
    const [evento, setEvento] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDatos = async () => {
            if (!eventId || !guestId) {
                setError('Faltan parámetros en la URL');
                return;
            }

            try {
                setIsLoading(true);
                const responseInvitado = await API.get(`/guest/consultar/${guestId}`);
                const responseEvento = await API.get(`/events/${eventId}`);

                setInvitado(responseInvitado.data);
                setEvento(responseEvento.data);
            } catch (err) {
                setError('No se pudieron cargar los datos. Por favor, verifica la URL.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDatos();
    }, [eventId, guestId]);

    // Obtener el número de acompañantes (puede ser null o 0 si no tiene)
    const numberOfGuests = invitado?.numberOfGuests ?? 0;
    console.log(invitado)

    return { invitado, evento, isLoading, error, numberOfGuests };
}
