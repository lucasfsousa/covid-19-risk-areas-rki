const csv = require('csvtojson');

/**
 * This function will read `data/world-countries-iso.csv` and returns it as a JSON.
 * This file was downloaded from:
 * https://github.com/sueddeutsche/sz-data/blob/master/world-countries/world-countries-iso
 */
export default async (): Promise<CountryMetadata[]> => {
    return csv({delimiter: ';'})
        .fromFile('data/world-countries-iso.csv');
}

interface CountryMetadata {
    name_en: string;
    name_en_official: string;
    name_de: string;
    iso_alpha_2: string;
    iso_alpha_3: string;
    iso_numeric: number;
}
