import "ol/ol.css";
import GeoJSON from "ol/format/GeoJSON";
import Map from "ol/Map";
import Overlay from 'ol/Overlay';
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import View from "ol/View";
import {Fill, Stroke, Style, Text} from "ol/style";
import {errors, lastUpdate, riskAreas, rkiLastUpdate} from "./risk-areas";
import {transform} from "ol/proj";
import {defaults as defaultControls} from 'ol/control';

const backgrounds = {
    default: "#e8e8e8",
    totalBlocked: "#ff5001",
    partialBlocked: "#ffbf00",
}

const attributions =
    `
    <h3>This is an opensource project that shows international risk areas according to <a target="_blank" href="https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Risikogebiete_neu.html">Robert Koch-Institut© (RKI)</a></h3>
    <p>This website is not related by any means with the German government and the information here can contain errors or be outdated.<br />
    Please check <a target="_blank" href="https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Risikogebiete_neu.html">RKI</a> website for updated information.</p>
    <small>This website will be automatically updated every hour, Last update: <code>${lastUpdate} CET</code></small><br />
    <small>RKI last update: <code>${rkiLastUpdate} CET</code></small>
    <p>If you want to contribute, please check <a target="_blank" href="https://github.com/lucasfsousa/covid-19-risk-areas-rki">Github repository</a>.</p>
    ${errors.length > 0 ? '<h4 style="color: #b30000">Unfortunately we had some errors in the last import, please check console for more details.</h4>' : ''}
    `;

export default () => {
    /**
     * Overlay that contains the risk area details
     */
    const riskAreasDetailOverlay = new Overlay({
        element: document.getElementById('riskAreaContainer'),
        autoPan: true,
        autoPanAnimation: {
            duration: 200,
        },
    });

    const style = new Style({
        fill: new Fill({
            color: backgrounds.default
        }),
        stroke: new Stroke({
            color: "#202020",
            width: 0.5
        }),
        text: new Text({
            font: "1.5ex Helvetica",
            fill: new Fill({
                color: "#000"
            })
        }),
    });

    const vectorLayer = new VectorLayer({
        source: new VectorSource({
            attributions: attributions,
            url: "countries.geojson",
            format: new GeoJSON()
        }),
        style: feature => {
            const riskArea = riskAreas.find(it => it.isoAlpha3 === feature.getId())

            if (riskArea) {
                if (riskArea.blocked === 'total') {
                    style.getFill().setColor(backgrounds.totalBlocked);
                } else {
                    style.getFill().setColor(backgrounds.partialBlocked);
                }
            } else {
                style.getFill().setColor(backgrounds.default);
            }
            style.getText().setText('');
            return style;
        }
    });

    const view = new View({
        center: transform([12, 30], 'EPSG:4326', 'EPSG:3857'),
        zoom: 1,
    });

    const map = new Map({
        layers: [
            vectorLayer,
        ],
        controls: defaultControls({ attributionOptions: { collapsible: true, collapsed: false  } }),
        overlays: [riskAreasDetailOverlay],
        target: "map",
        view: view,
    });

    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    const closer = document.getElementById('riskAreaClose');
    closer.onclick = () => {
        riskAreasDetailOverlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    /**
     * Add a click handler to the map to render the popup.
     */
    map.on('singleclick', evt => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, feature => feature);

        if (feature) {
            const riskArea = riskAreas.find(it => it.isoAlpha3 === feature.getId())

            let html = `<strong>${feature.get("name")}</strong><br/>`;
            if (riskArea) {
                html += `<code>${riskArea.originalHtml}</code>`;
            } else {
                html += `is not on the list as an international risk area`;
            }

            document.getElementById('riskAreaContent').innerHTML = html;
            riskAreasDetailOverlay.setPosition(evt.coordinate);
        }
    });
}
