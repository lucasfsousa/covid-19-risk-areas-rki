import {getRiskAreas} from "./get-risk-areas";
const fs = require('fs');
const moment = require('moment-timezone');

getRiskAreas().then(areas => {
    const current = moment().tz("Europe/Berlin").format('DD/MM/YYYY HH:mm');

    const s = `export const lastUpdate = '${current}';\nexport const riskAreas = ${JSON.stringify(areas)}`;

    fs.writeFile("../risk-areas.js", s, function(err: any) {
        if(err) {
            throw err;
        }
        console.log("The file was saved!");
    });
});
