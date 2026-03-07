

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

// MAPA BASE MAPBOX
var mapabase2 = L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    {
        attribution: '© Mapbox © OpenStreetMap',
        tileSize: 512,
        zoomOffset: -1,
        maxZoom: 20,
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoiZ2lvbmVncmlzbmVhZCIsImEiOiJjbG5lb3hkZjgwYjYwMmpuNTdjZmhpeGhvIn0.9FgP2sPU8iUZHEd_23jKLg'
    }
);

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

// OBJETO PARA GUARDAR EL GEOJSON
var capaAOI;

// BASEMAPS PARA CONTROL
var baseMaps = {
    "OpenStreetMap": mapabase1,
    "Mapbox": mapabase2
};

// CARGAR GEOJSON
fetch('data/aoi1P.geojson')
.then(function(response) {
    return response.json();
})
.then(function(data) {

    capaAOI = L.geoJSON(data, {
        style: {
            color: "red",
            weight: 2,
            fillOpacity: 0.1
        }
    }).addTo(mapa1);

    mapa1.fitBounds(capaAOI.getBounds());

    // OVERLAYS
    var overlays = {
        "Radar": capaprueba,
        "AOI": capaAOI
    };

    // CONTROL DE CAPAS
    L.control.layers(baseMaps, overlays).addTo(mapa1);

})
.catch(function(error) {
    console.log("Error cargando GeoJSON:", error);
});