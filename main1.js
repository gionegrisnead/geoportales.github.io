
/////////////////////////////////////////////////////////////////////////////

// CREAR OBJETO MAPA
var mapa1 = L.map('contenedor-map', {
    center: [-24.50, -57.09],
    zoom: 7
});

// MAPA BASE OPENSTREETMAP
var mapabase1 = L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
).addTo(mapa1);

// WMS DE PRUEBA
var capaprueba = L.tileLayer.wms(
    "http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi",
    {
        layers: 'nexrad-n0r-900913',
        format: 'image/png',
        transparent: true,
        attribution: "Weather data © 2012 IEM Nexrad"
    }
);

// OBJETOS PARA GUARDAR GEOJSON
var capaAOI;
var capadpto;


var datosDpto;
var capa_arroz;

// BASEMAPS
var baseMaps = {
    "OpenStreetMap": mapabase1
};

// OVERLAYS VACIO
var overlays = {
    "Radar": capaprueba
};

// CONTROL DE CAPAS
var controlCapas = L.control.layers(baseMaps, overlays).addTo(mapa1);


// ===============================
// CARGAR GEOJSON AOI
// ===============================

fetch('aoi1P.geojson')
.then(response => response.json())
.then(data => {

    capaAOI = L.geoJSON(data, {
        style: {
            color: "red",
            weight: 2,
            fillOpacity: 0.1
        }
    }).addTo(mapa1);

    mapa1.fitBounds(capaAOI.getBounds());

    controlCapas.addOverlay(capaAOI, "AOI");

})
.catch(function(error) {
    console.log("Error cargando AOI:", error);
});


// ===============================
// CARGAR GEOJSON DPTO
// ===============================

fetch('dpto_agm_2025.geojson')
.then(response => response.json())
.then(data => {

    capadpto = L.geoJSON(data, {
        style: {
            color: "blue",
            weight: 2,
            fillOpacity: 0.1
        }
    }).addTo(mapa1);

    controlCapas.addOverlay(capadpto, "Departamentos")

    })
.catch(function(error) {
    console.log("Error cargando AOI:", error);
});

// ===============================
// CARGAR GEOJSON arroz
// ===============================

fetch('capa_arroz.geojson')
.then(response => response.json())
.then(data => {

    capa_arroz = L.geoJSON(data, {
        style: {
            color: "green",
            weight: 2,
            fillOpacity: 0.1
        }
    }).addTo(mapa1);

    controlCapas.addOverlay(capa_arroz, "Arroz")

    })
.catch(function(error) {
    console.log("Error cargando AOI:", error);
});