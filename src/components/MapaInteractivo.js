import { useEffect } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

export default function MapaInteractivo() {
    useEffect(() => {
        const loader = new Loader({
            apiKey: "YOUR_GOOGLE_MAPS_API_KEY",
            version: "weekly",
        });

        loader.load().then(() => {
            const map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: 19.4326, lng: -99.1332 },
                zoom: 15,
            });

            new google.maps.Marker({
                position: { lat: 19.4326, lng: -99.1332 },
                map,
                title: "Ubicación de la boda",
            });
        });
    }, []);

    return (
        <div id="map" style={{ height: "300px", width: "100%" }} className="rounded-lg shadow-md"></div>
    )
}

