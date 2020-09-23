import getRiskAreas from "./get-risk-areas";
const fs = require('fs');
const moment = require('moment-timezone');

/**
 * This function gets the risk areas and generate `src/risk-areas.ts` file.
 * This output file will be used to plot the risk areas in the map.
 */
getRiskAreas().then(result => {
    const outputFile = '../src/risk-areas.ts';
    const currentDatetime = moment().tz("Europe/Berlin").format('DD.M.YYYY, HH:mm');

    const content = `
export const lastUpdate = '${currentDatetime}';
export const rkiLastUpdate = '${result.rkiLastUpdate}';
export const riskAreas = ${JSON.stringify(result.riskAreas)};
`;

    fs.writeFile(outputFile, content, (err: any) => {
        if(err) {
            throw err;
        }
        console.log(`The file was generated to: '${outputFile}'`);
    });
});
