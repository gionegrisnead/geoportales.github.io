
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

// VARIABLE PARA GUARDAR DATOS ORIGINALES
var datosDpto;

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

    controlCapas.addOverlay(capadpto, "Departamentos");

// ===============================
    // GENERAR LISTA DE FILTROS
    // ===============================

    var valores = [];

    data.features.forEach(function(f) {
        
        var dpto = f.properties.DPTO_DESC;

        if(!valores.includes(dpto)){
            valores.push(dpto);
        }

    });

    valores.sort();

    var select = document.getElementById("filtro-dpto");

    valores.forEach(function(v) {

        var option = document.createElement("option");

        option.value = v;
        option.text = v;

        select.appendChild(option);

    });


// ===============================
// EVENTO DE FILTRO
// ===============================

select.addEventListener("change",function(){

        var valor = this.value;

        capadpto.clearLayers();

        datosDpto.features.forEach(function(feature){

            if(valor === "todos" || feature.properties.DPTO_DESC === valor){

                capadpto.addData(feature);

            }
        });
    });
})
.catch(error => console.log("Error DPTO:",error));
