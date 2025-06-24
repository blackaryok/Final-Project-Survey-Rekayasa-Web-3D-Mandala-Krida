// Your main script file (e.g., main.js)

import { accessToken } from "./js/CesiumConfig.js";
import { data } from "./js/data.js";
import { createSelectElement } from "./js/DropDown.js";
import { chooseAndLoadData } from "./js/cesiumdataselect.js";

Cesium.Ion.defaultAccessToken = accessToken;

const viewer = new Cesium.Viewer('cesiumContainer', {
    terrain: Cesium.EllipsoidTerrainProvider(),
});

viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(110.384, -7.8075, 700),
    orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-35.0),
    }
});

const geojsonUrl = './data/tesjalan4326.geojson';
const geojsonDataSource = Cesium.GeoJsonDataSource.load(geojsonUrl, {
    stroke: Cesium.Color.HOTPINK,
    fill: Cesium.Color.YELLOW.withAlpha(0.7),
    strokeWidth: 3
});
viewer.dataSources.add(geojsonDataSource);


const options = Object.values(data).map((dataObject, index) => ({
    value: index,
    textContent: dataObject.tipeData
}));

const dropdown = createSelectElement(options, "toolbar");


let activeLayer = {
    layer: null,
    type: null
};


function removeActiveLayer() {
    if (activeLayer.layer) {
        if (activeLayer.type === '3d-tileset') {
            viewer.scene.primitives.remove(activeLayer.layer);
        } else if (activeLayer.type === 'geojson') {
            viewer.dataSources.remove(activeLayer.layer);
        }
        activeLayer.layer = null;
        activeLayer.type = null;
    }
}

async function loadInitialData() {
    const initialData = Object.values(data)[0]; // Get the first data object
    activeLayer.layer = await chooseAndLoadData(viewer, initialData);
    activeLayer.type = initialData.type;
}


loadInitialData();

if (dropdown) {
    dropdown.addEventListener("change", async (event) => {
        removeActiveLayer();
        const selectedIndex = event.target.value;
        const selectedData = Object.values(data)[selectedIndex];

        activeLayer.layer = await chooseAndLoadData(viewer, selectedData);
        activeLayer.type = selectedData.type;
    });
}

const pohon = './data/pohonfix4326.geojson';
const pohonSource = await Cesium.GeoJsonDataSource.load(pohon, {
    markerColor: Cesium.Color.PURPLE,
    markerSize: 15,
    markerSymbol: 'circle',  // atau 'circle', 'dot', 'x', dsb
});

viewer.dataSources.add(pohonSource);
