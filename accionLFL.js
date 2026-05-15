// 1. INICIALIZAR EL MAPA
// Centrado en RD
var map = L.map('map').setView([19.02, -70.41], 9);  

// 2. CAPA BASE (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// 3. FUNCIÓN PARA CORREGIR COORDENADAS AL VUELO
// Esta función lee el GeoJSON y voltea las coordenadas sin modificar tus archivos originales.
function cargarGeoJSONCorregido(url, estilo, nombreCapa) {
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar ' + url);
            return response.json();
        })
        .then(data => {
            L.geoJSON(data, {
                // Leaflet usa coordsToLatLng para convertir [lng, lat] a [lat, lng]
                coordsToLatLng: function (coords) {
                    return new L.LatLng(coords[1], coords[0]);
                },
                style: estilo,
                onEachFeature: function (feature, layer) {
                    let popupContent = `<b>${nombreCapa}</b>`;
                    if (feature.properties && feature.properties.Name) {
                        popupContent += `<br>${feature.properties.Name}`;
                    }
                    layer.bindPopup(popupContent);
                }
            }).addTo(map);
            console.log(nombreCapa + ' cargada con éxito.');
        })
        .catch(error => console.error('Error:', error));
}

// 4. DEFINIR ESTILOS
const estiloCuenca = {
    color: "#2ecc71",   // Verde para la cuenca
    weight: 2,
    fillColor: "#2ecc71",
    fillOpacity: 0.2
};

const estiloCauce = {
    color: "#2980b9",    // Azul para el río
    weight: 4,
    opacity: 0.9,
    lineCap: 'round'
};

// 5. EJECUTAR CARGA DE ARCHIVOS
// Asegúrate de que los nombres de archivo coincidan exactamente con GitHub
cargarGeoJSONCorregido('cuencaOZAMA.geojson', estiloCuenca, 'Cuenca del río Ozama');
cargarGeoJSONCorregido('cauceOZAMA.geojson', estiloCauce, 'Cauce del río Ozama');
cargarGeoJSONCorregido('cuencaYUMA.geojson', estiloCuenca, 'Cuenca del río Yuma');
cargarGeoJSONCorregido('cauceYUMA.geojson', estiloCauce, 'Cauce del río Yuma');
cargarGeoJSONCorregido('cuencaMAIMONESTE.geojson', estiloCuenca, 'Cuenca del río Maimón del Este');
cargarGeoJSONCorregido('cauceMAIMONESTE.geojson', estiloCauce, 'Cauce del río Maimón del Este');
cargarGeoJSONCorregido('cuencaYUNA.geojson', estiloCuenca, 'Cuenca del río Yuna');
cargarGeoJSONCorregido('cauceYUNA.geojson', estiloCauce, 'Cauce del río Yuna');
cargarGeoJSONCorregido('cuencaYNORTE.geojson', estiloCuenca, 'Cuenca del río Yaque del Norte');
cargarGeoJSONCorregido('cauceYNORTE.geojson', estiloCauce, 'Cauce del río Yaque del Norte');


// 6. MARCADORES ADICIONALES (Opcional - Ejemplo de puntos manuales)
// Estos ya usan [Lat, Lng] por defecto en Leaflet
//var marcadorDesembocadura = L.marker([18.48, -69.88]).addTo(map);
//marcadorDesembocadura.bindPopup("<b>Desembocadura Río Ozama</b><br>Puerto de Santo Domingo");
