// 1. INICIALIZAR EL MAPA
// Centrado en RD
var map = L.map('map').setView([19.03556466237287, -70.89432006796727], 8);  

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
cargarGeoJSONCorregido('cuencaANAMUYA.json', estiloCuenca, 'Cuenca del río Anamuya');
cargarGeoJSONCorregido('cauceANAMUYA.json', estiloCauce, 'Cauce del río Anamuya');
cargarGeoJSONCorregido('cuencaBRUJUELAS.json', estiloCuenca, 'Cuenca del río Brujuelas o Tosa');
cargarGeoJSONCorregido('cauceBRUJUELAS.json', estiloCauce, 'Cauce del río Brujuelas o Tosa');
cargarGeoJSONCorregido('cuencaHIGUAMO.json', estiloCuenca, 'Cuenca del río Higuamo');
cargarGeoJSONCorregido('cauceHIGUAMO.json', estiloCauce, 'Cauce del río Higuamo');
cargarGeoJSONCorregido('cuencaSOCO.json', estiloCuenca, 'Cuenca del río Soco');
cargarGeoJSONCorregido('cauceSOCO.json', estiloCauce, 'Cauce del río Soco');
cargarGeoJSONCorregido('cuencaCUMAYASA.json', estiloCuenca, 'Cuenca del río Cumayasa');
cargarGeoJSONCorregido('cauceCUMAYASA.json', estiloCauce, 'Cauce del río Cumayasa');
cargarGeoJSONCorregido('cuencaROMANA.json', estiloCuenca, 'Cuenca del río Romana, Dulce o Salado');
cargarGeoJSONCorregido('cauceROMANA.json', estiloCauce, 'Cauce del río Romana, Dulce o Salado');
cargarGeoJSONCorregido('cuencaCHAVON.json', estiloCuenca, 'Cuenca del río Chavón');
cargarGeoJSONCorregido('cauceCHAVON.json', estiloCauce, 'Cauce del río Chavón');
cargarGeoJSONCorregido('cuencaYABON.json', estiloCuenca, 'Cuenca del río Yabón');
cargarGeoJSONCorregido('cauceYABON.json', estiloCauce, 'Cauce del río Yabón');
cargarGeoJSONCorregido('cuencaMAGUA.json', estiloCuenca, 'Cuenca del río Maguá');
cargarGeoJSONCorregido('cauceMAGUA.json', estiloCauce, 'Cauce del río Maguá');
cargarGeoJSONCorregido('cuencaCUARON.json', estiloCuenca, 'Cuenca del río Cuarón');
cargarGeoJSONCorregido('cauceCUARON.json', estiloCauce, 'Cauce del río Cuarón');
cargarGeoJSONCorregido('cuencaJOVERO.json', estiloCuenca, 'Cuenca del río Jovero');
cargarGeoJSONCorregido('cauceJOVERO.json', estiloCauce, 'Cauce del río Jovero');
cargarGeoJSONCorregido('cuencaYEGUADA.json', estiloCuenca, 'Cuenca del río Yeguada');
cargarGeoJSONCorregido('cauceYEGUADA.json', estiloCauce, 'Cauce del río Yeguada');

cargarGeoJSONCorregido('cuencaYUNA.geojson', estiloCuenca, 'Cuenca del río Yuna');
cargarGeoJSONCorregido('cauceYUNA.geojson', estiloCauce, 'Cauce del río Yuna');
cargarGeoJSONCorregido('cuencaYNORTE.geojson', estiloCuenca, 'Cuenca del río Yaque del Norte');
cargarGeoJSONCorregido('cauceYNORTE.geojson', estiloCauce, 'Cauce del río Yaque del Norte');
cargarGeoJSONCorregido('cuencaBACUI.geojson', estiloCuenca, 'Cuenca del río Bacuí');
cargarGeoJSONCorregido('cauceBACUI.geojson', estiloCauce, 'Cauce del río Bacuí');
cargarGeoJSONCorregido('cuencaBAJABONICO.geojson', estiloCuenca, 'Cuenca del río Bajabonico');
cargarGeoJSONCorregido('cauceBAJABONICO.geojson', estiloCauce, 'Cauce del río Bajabonico');
cargarGeoJSONCorregido('cuencaBOBA.geojson', estiloCuenca, 'Cuenca del río Boba');
cargarGeoJSONCorregido('cauceBOBA.geojson', estiloCauce, 'Cauce del río Boba');
cargarGeoJSONCorregido('cuencaELLIMON.geojson', estiloCuenca, 'Cuenca del río El Limón');
cargarGeoJSONCorregido('cauceELLIMON.geojson', estiloCauce, 'Cauce del río El Limón');
cargarGeoJSONCorregido('cuencaJOBA.geojson', estiloCuenca, 'Cuenca del río Joba');
cargarGeoJSONCorregido('cauceJOBA.geojson', estiloCauce, 'Cauce del río Joba');
cargarGeoJSONCorregido('cuencaMAIMONCIBAO.geojson', estiloCuenca, 'Cuenca del río Maimón del norte');
cargarGeoJSONCorregido('cauceMAIMONCIBAO.geojson', estiloCauce, 'Cauce del río Maimón del norte');
cargarGeoJSONCorregido('cuencaSMARCOS.json', estiloCuenca, 'Cuenca del río San Marcos');
cargarGeoJSONCorregido('cauceSMARCOS.json', estiloCauce, 'Cauce del río San Marcos');
cargarGeoJSONCorregido('cuencaNAGUA.geojson', estiloCuenca, 'Cuenca del río Nagua');
cargarGeoJSONCorregido('cauceNAGUA.geojson', estiloCauce, 'Cauce del río Nagua');
cargarGeoJSONCorregido('cuencaSJUANCIBAO.geojson', estiloCuenca, 'Cuenca del río San Juan del Cibao');
cargarGeoJSONCorregido('cauceSJUANCIBAO.geojson', estiloCauce, 'Cauce del río San Juan del Cibao');
cargarGeoJSONCorregido('cuencaYASICA.geojson', estiloCuenca, 'Cuenca del río Yásica');
cargarGeoJSONCorregido('cauceYASICA.geojson', estiloCauce, 'Cauce del río Yásica');
cargarGeoJSONCorregido('cuencaCAMU.json', estiloCuenca, 'Cuenca del río Camú del norte');
cargarGeoJSONCorregido('cauceCAMU.json', estiloCauce, 'Cauce del río Camú del norte');
cargarGeoJSONCorregido('cuencaMASACRE.json', estiloCuenca, 'Cuenca del río Dajabón o Masacre');
cargarGeoJSONCorregido('cauceMASACRE.json', estiloCauce, 'Cauce del río Dajabón o Masacre');
cargarGeoJSONCorregido('cuencaCHACUEY.json', estiloCuenca, 'Cuenca del río Chacuey');
cargarGeoJSONCorregido('cauceCHACUEY.json', estiloCauce, 'Cauce del río Chacuey');

cargarGeoJSONCorregido('cuencaHAINA.json', estiloCuenca, 'Cuenca del río Haina');
cargarGeoJSONCorregido('cauceHAINA.json', estiloCauce, 'Cauce del río Haina');
cargarGeoJSONCorregido('cuencaNIGUA.json', estiloCuenca, 'Cuenca del río Nigua');
cargarGeoJSONCorregido('cauceNIGUA.json', estiloCauce, 'Cauce del río Nigua');
cargarGeoJSONCorregido('cuencaNIZAO.json', estiloCuenca, 'Cuenca del río Nizao');
cargarGeoJSONCorregido('cauceNIZAO.json', estiloCauce, 'Cauce del río Nizao');
cargarGeoJSONCorregido('cuencaOCOA.json', estiloCuenca, 'Cuenca del río Ocoa');
cargarGeoJSONCorregido('cauceOCOA.json', estiloCauce, 'Cauce del río Ocoa');
cargarGeoJSONCorregido('cuencaJURA.json', estiloCuenca, 'Cuenca del río Jura');
cargarGeoJSONCorregido('cauceJURA.json', estiloCauce, 'Cauce del río Jura');
cargarGeoJSONCorregido('cuencaTABARA.json', estiloCuenca, 'Cuenca del río Tábara');
cargarGeoJSONCorregido('cauceTABARA.json', estiloCauce, 'Cauce del río Tábara');
cargarGeoJSONCorregido('cuencaYSUR.json', estiloCuenca, 'Cuenca del río Yaque del Sur');
cargarGeoJSONCorregido('cauceYSUR.json', estiloCauce, 'Cauce del río Yaque del Sur');
cargarGeoJSONCorregido('cuencaNIZAITO.json', estiloCuenca, 'Cuenca del río Nizaito');
cargarGeoJSONCorregido('cauceNIZAITO.json', estiloCauce, 'Cauce del río Nizaito');
cargarGeoJSONCorregido('cuencaPEDERNALES.json', estiloCuenca, 'Cuenca del río Pedernales');
cargarGeoJSONCorregido('caucePEDERNALES.json', estiloCauce, 'Cauce del río Pedernales');
cargarGeoJSONCorregido('cuencaVIA.json', estiloCuenca, 'Cuenca del río Vía');
cargarGeoJSONCorregido('cauceVIA.json', estiloCauce, 'Cauce del río Vía');
cargarGeoJSONCorregido('cuencaBANI.json', estiloCuenca, 'Cuenca del río Baní / Banilejo');
cargarGeoJSONCorregido('cauceBANI.json', estiloCauce, 'Cauce del río Baní / Banilejo');

cargarGeoJSONCorregido('cuencaARTIBONITO.json', estiloCuenca, 'Cuenca del río Artibonito');
cargarGeoJSONCorregido('cauceARTIBONITO.json', estiloCauce, 'Cauce del río Artibonito');

// 6. MARCADORES ADICIONALES (Opcional - Ejemplo de puntos manuales)
// Estos ya usan [Lat, Lng] por defecto en Leaflet
//var marcadorDesembocadura = L.marker([18.48, -69.88]).addTo(map);
//marcadorDesembocadura.bindPopup("<b>Desembocadura Río Ozama</b><br>Puerto de Santo Domingo");
