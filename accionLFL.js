// 1. INICIALIZAR EL MAPA
// Ajusté la vista inicial para que se vea bien la República Dominicana
var map = L.map('map').setView([18.8, -70.2], 9); 

// 2. CAPA BASE DE OpenStreetMap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// 3. MARCADORES Y CÍRCULOS (Estos están bien porque usan [lat, lng])
var marker = L.marker([19.450952207797368, -70.6942803536542]).addTo(map);
marker.bindPopup("<b>Monumento HÉROES DE LA RESTAURACIÓN</b>").openPopup();

const estaciones = [
    { name: "Puente sobre río Haina", lat: 18.692226985047302, lng: -70.253662901458 },
    { name: "Balneario", lat: 18.697292116316408, lng: -70.24649043918144 },
    { name: "Puente SJ Puerto", lat: 18.70633880612011, lng: -70.22577745459196 },
    { name: "Almuerzo", lat: 18.782970282919432, lng: -70.26123476599899 }
];

estaciones.forEach(function(estacion) {
    L.marker([estacion.lat, estacion.lng])
        .addTo(map)
        .bindPopup("<b>" + estacion.name + "</b>");
});

const datos = [
    { nombre: "Estación A", lat: 18.47477046039134, lng: -69.91873800960404, temperatura: 22 },
    { nombre: "Estación B", lat: 18.49089212880385, lng: -69.9571556526422, temperatura: 18 }
];

datos.forEach(function(item) {
    L.circleMarker([item.lat, item.lng], {
        radius: item.temperatura,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        fillOpacity: 0.8
    }).addTo(map)
      .bindPopup(item.nombre + ": " + item.temperatura + "°C");
});

// ========== FUNCIÓN CLAVE: INVERTIR COORDENADAS ==========
// Convierte un GeoJSON de [lng, lat] a [lat, lng]
function invertirCoordenadas(geojson) {
    if (!geojson || !geojson.features) return geojson;
    
    geojson.features.forEach(feature => {
        const geom = feature.geometry;
        if (!geom) return;
        
        // Invertir coordenadas de un anillo (una línea o un anillo de polígono)
        const invertirAnillo = (anillo) => anillo.map(coord => [coord[1], coord[0]]);
        
        if (geom.type === 'Polygon') {
            geom.coordinates = geom.coordinates.map(invertirAnillo);
        } 
        else if (geom.type === 'MultiPolygon') {
            geom.coordinates = geom.coordinates.map(polygon => 
                polygon.map(invertirAnillo)
            );
        }
        else if (geom.type === 'LineString') {
            geom.coordinates = invertirAnillo(geom.coordinates);
        }
        else if (geom.type === 'MultiLineString') {
            geom.coordinates = geom.coordinates.map(invertirAnillo);
        }
    });
    
    return geojson;
}

// ========== CARGAR CUENCA (POLÍGONO) ==========
function estiloCuenca(feature) {
    return {
        fillColor: '#228B22',
        color: '#006400',
        weight: 2,
        fillOpacity: 0.3,
        opacity: 1
    };
}

fetch('cuencaOZAMA.geojson')
    .then(response => {
        if (!response.ok) throw new Error('No se pudo cargar cuencaOZAMA.geojson');
        return response.json();
    })
    .then(data => {
        // Aquí está la magia: invertimos las coordenadas ANTES de añadirlas al mapa
        const dataCorregido = invertirCoordenadas(data);
        const capaCuenca = L.geoJSON(dataCorregido, {
            style: estiloCuenca,
            onEachFeature: function(feature, layer) {
                let contenido = "<b>Cuenca Ozama</b><br>";
                if (feature.properties && feature.properties.Name) 
                    contenido += feature.properties.Name;
                layer.bindPopup(contenido);
            }
        }).addTo(map);
        
        console.log('Cuenca cargada correctamente');
        // Opcional: Ajustar el mapa para que encaje con la cuenca
        // map.fitBounds(capaCuenca.getBounds());
    })
    .catch(error => console.error('Error cargando la cuenca:', error));

// ========== CARGAR CAUCE (LÍNEA) ==========
function estiloCauce(feature) {
    return {
        color: '#1E90FF',
        weight: 3,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
    };
}

fetch('cauceOZAMA.geojson')
    .then(response => {
        if (!response.ok) throw new Error('No se pudo cargar cauceOZAMA.geojson');
        return response.json();
    })
    .then(data => {
        // Aplicamos la misma corrección aquí
        const dataCorregido = invertirCoordenadas(data);
        const capaCauce = L.geoJSON(dataCorregido, {
            style: estiloCauce,
            onEachFeature: function(feature, layer) {
                let contenido = "<b>Cauce Río Ozama</b>";
                if (feature.properties && feature.properties.Name) 
                    contenido += "<br>" + feature.properties.Name;
                layer.bindPopup(contenido);
            }
        }).addTo(map);
        
        console.log('Cauce cargado correctamente');
    })
    .catch(error => console.error('Error cargando el cauce:', error));