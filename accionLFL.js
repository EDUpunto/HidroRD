// 1. INICIALIZAR EL MAPA
var map = L.map('map').setView([19.03556466237287, -70.89432006796727], 8);

// 2. CAPA BASE
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 3. FUNCIÓN DE CARGA DINÁMICA DE POPUPS
function cargarGeoJSONCorregido(url, estilo, nombreCapa) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                coordsToLatLng: function (coords) {
                    return new L.LatLng(coords[1], coords[0]);
                },
                style: estilo,
                onEachFeature: function (feature, layer) {
                    // Lógica para construir el popup dinámicamente
                    let props = feature.properties;
                    let popupContent = `<div style="font-family: sans-serif;">
                        <h4 style="margin:0; color:#2c3e50;">${nombreCapa}</h4>
                        <hr style="margin:5px 0;">`;
                    
                    // Iterar sobre las propiedades del archivo para mostrar toda la info
                    if (props) {
                        for (let key in props) {
                            // Omitir campos vacíos o nombres internos si es necesario
                            if (props[key]) {
                                popupContent += `<b>${key}:</b> ${props[key]}<br>`;
                            }
                        }
                    } else {
                        popupContent += `<p>Sin datos adicionales.</p>`;
                    }
                    popupContent += `</div>`;
                    
                    layer.bindPopup(popupContent);
                }
            }).addTo(map);
        })
        .catch(err => console.error("Error al cargar " + url, err));
}

// Ejemplo de uso para tus capas
// Asegúrate de que tus archivos .json tengan una estructura válida { "type": "FeatureCollection", ... }
cargarGeoJSONCorregido('cuencaTABARA.json', { color: 'blue', weight: 2 }, 'Cuenca del río Tábara');