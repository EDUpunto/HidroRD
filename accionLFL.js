// ─────────────────────────────────────────────
//  HIDROGRAFÍA RD — accionLFL.js
// ─────────────────────────────────────────────

// 1. CAPAS BASE
var capaOSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var capaSatelite = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: '© <a href="https://www.esri.com">Esri</a> World Imagery'
});

// 2. INICIALIZAR MAPA
var map = L.map('map', {
    center: [19.03556466237287, -70.89432006796727],
    zoom: 8,
    layers: [capaOSM],
    zoomControl: true
});

// Colocar Escala en la esquina inferior derecha con fondo específico manejado por CSS
L.control.scale({
    imperial: false,
    position: 'bottomright',
    maxWidth: 120
}).addTo(map);

// Atribución en la esquina inferior derecha
map.attributionControl.setPosition('bottomright');

// 3. EVITAR PROPAGACIÓN DE CLICS EN EL MENU DESPLEGABLE
var mapControl = document.getElementById('vista-mapa-control');
if (mapControl) {
    L.DomEvent.disableClickPropagation(mapControl);
}

// Lógica de apertura/cierre de menú dropdown
window.toggleDropdown = function() {
    var dropdown = document.getElementById("map-dropdown");
    if (dropdown) {
        dropdown.classList.toggle("show");
    }
};

// Cerrar menú si se hace clic fuera
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdown = document.getElementById("map-dropdown");
        if (dropdown && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
};

// Cambiar vistas de mapa
window.setView = function(tipo) {
    if (tipo === 'satelite') {
        map.removeLayer(capaOSM);
        capaSatelite.addTo(map);
        document.getElementById('btn-dibujo').classList.remove('active');
        document.getElementById('btn-satelite').classList.add('active');
    } else {
        map.removeLayer(capaSatelite);
        capaOSM.addTo(map);
        document.getElementById('btn-satelite').classList.remove('active');
        document.getElementById('btn-dibujo').classList.add('active');
    }
    // Ocultar dropdown tras seleccionar
    document.getElementById("map-dropdown").classList.remove("show");
};

// 4. ESTADO GLOBAL
var todasLasCapas = [];   // { cuencaLayer, cauceLayer, nombre }
var cuencaSeleccionada = null;

// 5. ESTILOS DE CAPAS
var estiloCuenca = {
    color: "#27ae60",
    weight: 1.5,
    fillColor: "#2ecc71",
    fillOpacity: 0.18,
    opacity: 0.8
};

var estiloCauce = {
    color: "#2980b9",
    weight: 3.5,
    opacity: 0.9,
    lineCap: 'round'
};

var estiloOpacadoCuenca = {
    color: "#27ae60",
    weight: 1,
    fillColor: "#2ecc71",
    fillOpacity: 0.04,
    opacity: 0.15
};

var estiloOpacadoCauce = {
    color: "#2980b9",
    weight: 1.5,
    opacity: 0.12
};

var estiloResaltadoCuenca = {
    color: "#1a8a40",
    weight: 2.5,
    fillColor: "#2ecc71",
    fillOpacity: 0.45,
    opacity: 1
};

var estiloResaltadoCauce = {
    color: "#1a5f9e",
    weight: 5,
    opacity: 1
};

// 6. LÓGICA DE SELECCIÓN
function seleccionarCuenca(nombre) {
    cuencaSeleccionada = nombre;

    todasLasCapas.forEach(function(grupo) {
        var esSel = (grupo.nombre === nombre);

        if (grupo.cuencaLayer) {
            grupo.cuencaLayer.setStyle(esSel ? estiloResaltadoCuenca : estiloOpacadoCuenca);
            if (esSel) grupo.cuencaLayer.bringToFront();
        }
        if (grupo.cauceLayer) {
            grupo.cauceLayer.setStyle(esSel ? estiloResaltadoCauce : estiloOpacadoCauce);
            if (esSel) grupo.cauceLayer.bringToFront();
        }
    });

    document.getElementById('infoName').textContent = nombre;
    document.getElementById('infoPanel').classList.add('visible');
}

window.resetSeleccion = function() {
    cuencaSeleccionada = null;
    todasLasCapas.forEach(function(grupo) {
        if (grupo.cuencaLayer) grupo.cuencaLayer.setStyle(estiloCuenca);
        if (grupo.cauceLayer)  grupo.cauceLayer.setStyle(estiloCauce);
    });
    document.getElementById('infoPanel').classList.remove('visible');
};

map.on('click', function(e) {
    if (!e.originalEvent._fromLayer) resetSeleccion();
});

// 7. CARGA DE GEOJSON
var grupos = {};

function obtenerNombreRio(nombreCapa) {
    return nombreCapa.replace(/^(Cuenca|Cauce) del río /, '').trim();
}

function cargarGeoJSONCorregido(url, estilo, nombreCapa) {
    var esCuenca = nombreCapa.startsWith('Cuenca');
    var nombreRio = obtenerNombreRio(nombreCapa);

    if (!grupos[nombreRio]) grupos[nombreRio] = { nombre: nombreRio, cuencaLayer: null, cauceLayer: null };

    fetch(url)
        .then(function(response) {
            if (!response.ok) throw new Error('Error al cargar ' + url);
            return response.json();
        })
        .then(function(data) {
            var layer = L.geoJSON(data, {
                coordsToLatLng: function(coords) {
                    return new L.LatLng(coords[1], coords[0]);
                },
                style: estilo,
                onEachFeature: function(feature, featureLayer) {
                    featureLayer.on('click', function(e) {
                        e.originalEvent._fromLayer = true;
                        seleccionarCuenca(nombreCapa.replace(/^(Cuenca|Cauce) del río /, '').trim());
                    });
                    featureLayer.on('mouseover', function() {
                        if (!cuencaSeleccionada) {
                            featureLayer.setStyle(
                                esCuenca ? { fillOpacity: 0.38, weight: 2.5 }
                                         : { opacity: 1, weight: 5 }
                            );
                        }
                    });
                    featureLayer.on('mouseout', function() {
                        if (!cuencaSeleccionada) {
                            featureLayer.setStyle(estilo);
                        }
                    });
                    
                    var popupHTML = '<b style="font-family:\'Merriweather\',serif;color:#1a3a5c">'
                        + (esCuenca ? 'Cuenca' : 'Cauce') + ' del río</b><br>'
                        + '<span style="font-size:1rem;font-weight:600;color:#1a6bb5">' + nombreRio + '</span>';
                    featureLayer.bindPopup(popupHTML, { maxWidth: 200 });
                }
            }).addTo(map);

            if (esCuenca) {
                grupos[nombreRio].cuencaLayer = layer;
            } else {
                grupos[nombreRio].cauceLayer = layer;
            }

            todasLasCapas = Object.values(grupos);
        })
        .catch(function(error) { 
            console.warn('No se pudo cargar ' + url + ':', error.message); 
        });
}

// 8. EJECUCIÓN DE CARGAS DE CAPAS

// — Este lado de la isla —
cargarGeoJSONCorregido('cuencaOZAMA.geojson',    estiloCuenca, 'Cuenca del río Ozama');
cargarGeoJSONCorregido('cauceOZAMA.geojson',     estiloCauce,  'Cauce del río Ozama');
cargarGeoJSONCorregido('cuencaYUMA.geojson',     estiloCuenca, 'Cuenca del río Yuma');
cargarGeoJSONCorregido('cauceYUMA.geojson',      estiloCauce,  'Cauce del río Yuma');
cargarGeoJSONCorregido('cuencaMAIMONESTE.geojson', estiloCuenca, 'Cuenca del río Maimón del Este');
cargarGeoJSONCorregido('cauceMAIMONESTE.geojson',  estiloCauce,  'Cauce del río Maimón del Este');
cargarGeoJSONCorregido('cuencaANAMUYA.json',    estiloCuenca, 'Cuenca del río Anamuya');
cargarGeoJSONCorregido('cauceANAMUYA.json',     estiloCauce,  'Cauce del río Anamuya');
cargarGeoJSONCorregido('cuencaTOSA.json',       estiloCuenca, 'Cuenca del río Tosa o Brujuelas');
cargarGeoJSONCorregido('cauceTOSA.json',        estiloCauce,  'Cauce del río Tosa o Brujuelas');
cargarGeoJSONCorregido('cuencaHIGUAMO.json',    estiloCuenca, 'Cuenca del río Higuamo');
cargarGeoJSONCorregido('cauceHIGUAMO.json',     estiloCauce,  'Cauce del río Higuamo');
cargarGeoJSONCorregido('cuencaSOCO.json',       estiloCuenca, 'Cuenca del río Soco');
cargarGeoJSONCorregido('cauceSOCO.json',        estiloCauce,  'Cauce del río Soco');
cargarGeoJSONCorregido('cuencaCUMAYASA.json',   estiloCuenca, 'Cuenca del río Cumayasa');
cargarGeoJSONCorregido('cauceCUMAYASA.json',    estiloCauce,  'Cauce del río Cumayasa');
cargarGeoJSONCorregido('cuencaROMANA.json',     estiloCuenca, 'Cuenca del río Romana, Dulce o Salado');
cargarGeoJSONCorregido('cauceROMANA.json',      estiloCauce,  'Cauce del río Romana, Dulce o Salado');
cargarGeoJSONCorregido('cuencaCHAVON.json',     estiloCuenca, 'Cuenca del río Chavón');
cargarGeoJSONCorregido('cauceCHAVON.json',      estiloCauce,  'Cauce del río Chavón');
cargarGeoJSONCorregido('cuencaYABON.json',      estiloCuenca, 'Cuenca del río Yabón');
cargarGeoJSONCorregido('cauceYABON.json',       estiloCauce,  'Cauce del río Yabón');
cargarGeoJSONCorregido('cuencaMAGUA.json',      estiloCuenca, 'Cuenca del río Maguá');
cargarGeoJSONCorregido('cauceMAGUA.json',       estiloCauce,  'Cauce del río Maguá');
cargarGeoJSONCorregido('cuencaCUARON.json',     estiloCuenca, 'Cuenca del río Cuarón');
cargarGeoJSONCorregido('cauceCUARON.json',      estiloCauce,  'Cauce del río Cuarón');
cargarGeoJSONCorregido('cuencaJOBERO.json',     estiloCuenca, 'Cuenca del río Jobero');
cargarGeoJSONCorregido('cauceJOBERO.json',      estiloCauce,  'Cauce del río Jobero');
cargarGeoJSONCorregido('cuencaYEGUADA.json',    estiloCuenca, 'Cuenca del río Yeguada');
cargarGeoJSONCorregido('cauceYEGUADA.json',     estiloCauce,  'Cauce del río Yeguada');

// — Cibao y Norte —
cargarGeoJSONCorregido('cuencaYUNA.geojson',    estiloCuenca, 'Cuenca del río Yuna');
cargarGeoJSONCorregido('cauceYUNA.geojson',     estiloCauce,  'Cauce del río Yuna');
cargarGeoJSONCorregido('cuencaYNORTE.geojson',  estiloCuenca, 'Cuenca del río Yaque del Norte');
cargarGeoJSONCorregido('cauceYNORTE.geojson',   estiloCauce,  'Cauce del río Yaque del Norte');
cargarGeoJSONCorregido('cuencaBACUI.geojson',   estiloCuenca, 'Cuenca del río Bacuí');
cargarGeoJSONCorregido('cauceBACUI.geojson',    estiloCauce,  'Cauce del río Bacuí');
cargarGeoJSONCorregido('cuencaBAJABONICO.geojson', estiloCuenca, 'Cuenca del río Bajabonico');
cargarGeoJSONCorregido('cauceBAJABONICO.geojson',  estiloCauce,  'Cauce del río Bajabonico');
cargarGeoJSONCorregido('cuencaBOBA.geojson',    estiloCuenca, 'Cuenca del río Boba');
cargarGeoJSONCorregido('cauceBOBA.geojson',     estiloCauce,  'Cauce del río Boba');
cargarGeoJSONCorregido('cuencaELLIMON.geojson', estiloCuenca, 'Cuenca del río El Limón');
cargarGeoJSONCorregido('cauceELLIMON.geojson',  estiloCauce,  'Cauce del río El Limón');
cargarGeoJSONCorregido('cuencaJOBA.geojson',    estiloCuenca, 'Cuenca del río Joba');
cargarGeoJSONCorregido('cauceJOBA.geojson',     estiloCauce,  'Cauce del río Joba');
cargarGeoJSONCorregido('cuencaMAIMONCIBAO.geojson', estiloCuenca, 'Cuenca del río Maimón Cibao');
cargarGeoJSONCorregido('cauceMAIMONCIBAO.geojson',  estiloCauce,  'Cauce del río Maimón Cibao');
cargarGeoJSONCorregido('cuencaNAGUA.geojson',   estiloCuenca, 'Cuenca del río Nagua');
cargarGeoJSONCorregido('cauceNAGUA.geojson',    estiloCauce,  'Cauce del río Nagua');
cargarGeoJSONCorregido('cuencaSJUANCIBAO.geojson', estiloCuenca, 'Cuenca del río San Juan Cibao');
cargarGeoJSONCorregido('cauceSJUANCIBAO.geojson',  estiloCauce,  'Cauce del río San Juan Cibao');
cargarGeoJSONCorregido('cuencaYASICA.geojson',  estiloCuenca, 'Cuenca del río Yásica');
cargarGeoJSONCorregido('cauceYASICA.geojson',   estiloCauce,  'Cauce del río Yásica');
cargarGeoJSONCorregido('cuencaCAMU.json',       estiloCuenca, 'Cuenca del río Camú');
cargarGeoJSONCorregido('cauceCAMU.json',        estiloCauce,  'Cauce del río Camú');
cargarGeoJSONCorregido('cuencaMASACRE.json',    estiloCuenca, 'Cuenca del río Dajabón o Masacre');
cargarGeoJSONCorregido('cauceMASACRE.json',     estiloCauce,  'Cauce del río Dajabón o Masacre');
cargarGeoJSONCorregido('cuencaCHACUEY.json',    estiloCuenca, 'Cuenca del río Chacuey');
cargarGeoJSONCorregido('cauceCHACUEY.json',     estiloCauce,  'Cauce del río Chacuey');

// — Sur —
cargarGeoJSONCorregido('cuencaHAINA.json',      estiloCuenca, 'Cuenca del río Haina');
cargarGeoJSONCorregido('cauceHAINA.json',       estiloCauce,  'Cauce del río Haina');
cargarGeoJSONCorregido('cuencaNIGUA.json',      estiloCuenca, 'Cuenca del río Nigua');
cargarGeoJSONCorregido('cauceNIGUA.json',       estiloCauce,  'Cauce del río Nigua');
cargarGeoJSONCorregido('cuencaNIZAO.json',      estiloCuenca, 'Cuenca del río Nizao');
cargarGeoJSONCorregido('cauceNIZAO.json',       estiloCauce,  'Cauce del río Nizao');
cargarGeoJSONCorregido('cuencaOCOA.json',       estiloCuenca, 'Cuenca del río Ocoa');
cargarGeoJSONCorregido('cauceOCOA.json',        estiloCauce,  'Cauce del río Ocoa');
cargarGeoJSONCorregido('cuencaJURA.json',       estiloCuenca, 'Cuenca del río Jura');
cargarGeoJSONCorregido('cauceJURA.json',        estiloCauce,  'Cauce del río Jura');
cargarGeoJSONCorregido('cuencaTABARA.json',     estiloCuenca, 'Cuenca del río Tábara');
cargarGeoJSONCorregido('cauceTABARA.json',      estiloCauce,  'Cauce del río Tábara');
cargarGeoJSONCorregido('cuencaYSUR.json',       estiloCuenca, 'Cuenca del río Yaque del Sur');
cargarGeoJSONCorregido('cauceYSUR.json',        estiloCauce,  'Cauce del río Yaque del Sur');
cargarGeoJSONCorregido('cuencaNIZAITO.json',    estiloCuenca, 'Cuenca del río Nizaito');
cargarGeoJSONCorregido('cauceNIZAITO.json',     estiloCauce,  'Cauce del río Nizaito');
cargarGeoJSONCorregido('cuencaPEDERNALES.json', estiloCuenca, 'Cuenca del río Pedernales');
cargarGeoJSONCorregido('caucePEDERNALES.json',  estiloCauce,  'Cauce del río Pedernales');
cargarGeoJSONCorregido('cuencaVIA.json',        estiloCuenca, 'Cuenca del río Vía');
cargarGeoJSONCorregido('cauceVIA.json',         estiloCauce,  'Cauce del río Vía');
cargarGeoJSONCorregido('cuencaBANI.json',       estiloCuenca, 'Cuenca del río Baní / Banilejo');
cargarGeoJSONCorregido('cauceBANI.json',        estiloCauce,  'Cauce del río Baní / Banilejo');
cargarGeoJSONCorregido('cuencaARTIBONITO.json', estiloCuenca, 'Cuenca del río Artibonito');
cargarGeoJSONCorregido('cauceARTIBONITO.json',  estiloCauce,  'Cauce del río Artibonito');
