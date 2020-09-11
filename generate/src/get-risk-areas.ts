const axios = require('axios').default;
const cheerio = require('cheerio');
const csv = require('csvtojson');

const riskCountriesUrl = "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Risikogebiete_neu.html";
const rkiTextRegex = /^(.+)?\s\(.*\)/;
const rkiPartialBlockedAreaRegex = /^(.+)?\s(-|–)/;

const csvCountriesMetadataPath = 'data/world-countries-iso.csv';

export async function getRiskAreas(): Promise<RiskArea[]> {
    const countriesMetadata = await getCountriesMetadata();
    const rkiList = await getRkiList();

    return rkiList.map(area => {
        const country = countriesMetadata.find(it => it.name_de == area.nameGerman);
        if (!country) {
            console.error(`Could not find country named ${area.nameGerman}`);
            return null;
        }
        return {
            nameEnglish: country.name_en,
            nameGerman: country.name_de,
            isoAlpha3: country.iso_alpha_3,
            originalText: area.originalText,
            originalHtml: area.originalHtml,
            blocked: area.blocked,
        }
    }).filter(area => area != null);
}

async function getRkiList(): Promise<RiskAreaStatus[]> {
    return axios.get(riskCountriesUrl)
        .catch((err: string) => {
            console.error('Error oppening RKI page');
            throw Error(err);
        })
        .then((response: any) => {
            let $ = cheerio.load(response.data);

            const riskAreas: RiskAreaStatus[] = [];

            const countriesList = $('#main .text ul li').first().nextAll();
            $(countriesList).each((i: any, e: any): void => {
                const hasChildren = $(e).children().length > 0;
                const originalHtml = $(e).html();
                if (hasChildren) {
                    const originalText = $(e).find("p").text();

                    if (!originalText) {
                        console.log(`could not extract paragraph text from ${$(e).html()}`);
                        return null;
                    }

                    const groups = originalText.match(rkiPartialBlockedAreaRegex);

                    if (!groups || groups.length < 1) {
                        console.error(`${originalText} doesn't match regex`);
                        return null
                    }

                    riskAreas.push({
                        nameGerman: groups[1],
                        originalText: originalText,
                        originalHtml: originalHtml,
                        blocked: 'partial',
                    });
                } else {
                    const originalText = $(e).text()
                    const groups = originalText.match(rkiTextRegex)

                    if (!groups || groups.length < 1) {
                        console.error(`${originalText} doesn't match regex`);
                        return null
                    }

                    riskAreas.push({
                        nameGerman: groups[1],
                        originalText: originalText,
                        originalHtml: originalHtml,
                        blocked: 'total',
                    });
                }
            });

            return riskAreas;
        })
}

async function getCountriesMetadata(): Promise<CountryMetadata[]> {
    return csv({delimiter: ';'})
        .fromFile(csvCountriesMetadataPath);
}

export interface RiskAreaStatus {
    nameGerman: string;
    originalText: string;
    originalHtml: string;
    blocked: 'total' | 'partial';
}

export interface RiskArea {
    nameEnglish: string;
    nameGerman: string;
    isoAlpha3: string;
    originalText: string;
    originalHtml: string;
    blocked: 'total' | 'partial';
}

export interface CountryMetadata {
    name_en: string;
    name_en_official: string;
    name_de: string;
    iso_alpha_2: string;
    iso_alpha_3: string;
    iso_numeric: number;
}
