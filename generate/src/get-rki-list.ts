const axios = require('axios').default;
const cheerio = require('cheerio');

/**
 * This function will download RKI page and extract the list of countries considered as risk areas.
 * These countries can be partially or totally blocked.
 * The original HTML data will also be returned.
 */
export default async (): Promise<RkiList[]> => {
    const rkiUrl = "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Risikogebiete_neu.html";
    return axios.get(rkiUrl)
        .catch((err: string) => {
            console.error('Error opening RKI page');
            throw Error(err);
        })
        .then((response: any) => {
            let $ = cheerio.load(response.data);

            const riskAreas: RkiList[] = [];

            const countriesList = $('#main .text ul li').first().nextAll();
            $(countriesList).each((i: any, e: any): void => {
                /**
                 * if the country has children, that means that it is partially blocked with a list of places that are blocked.
                 */
                const isPartiallyBlockedArea = $(e).children().length > 0;

                let area: RkiList;
                if (isPartiallyBlockedArea) {
                    area = getPartiallyBlockedArea($(e));
                } else {
                    area = getTotallyBlockedArea($(e));
                }

                if (area != null) {
                    riskAreas.push(area);
                }
            });

            return riskAreas;
        })
}

/**
 * This function returns the area when the country is partially blocked, for example:
 * Frankreich – folgende Überseegebiete/Regionen gelten derzeit als Risikogebiete:
 * Rumänien – die folgenden Gebiete („Kreise“) gelten derzeit als Risikogebiete:
 */
function getPartiallyBlockedArea(htmlElement: any): RkiList | null {
    const regexPartiallyBlocked = /^(.+)?\s?(-|–)/;
    const originalHtml = htmlElement.html();
    const originalText = htmlElement.find("p").text();

    if (!originalText) {
        console.log(`could not extract paragraph text from ${originalHtml}`);
        return null;
    }

    const groups = originalText.match(regexPartiallyBlocked);

    if (!groups || groups.length < 1) {
        console.error(`${originalText} doesn't match regex`);
        return null
    }

    return {
        nameGerman: groups[1].trim(),
        originalHtml: originalHtml,
        blocked: 'partial',
    };
}

/**
 * This function returns the area when the country is totally blocked, for example:
 * Brasilien (seit 15. Juni)
 * USA (seit 3. Juli gesamte USA)
 */
function getTotallyBlockedArea(htmlElement: any): RkiList | null {
    const regexTotallyBlocked = /^(.+)?\s?\(.*\)/;
    const originalHtml = htmlElement.html();
    const originalText = htmlElement.text()
    const groups = originalText.match(regexTotallyBlocked)

    if (!groups || groups.length < 1) {
        console.error(`${originalText} doesn't match regex`);
        return null
    }

    return {
        nameGerman: groups[1].trim(),
        originalHtml: originalHtml,
        blocked: 'total',
    };
}

interface RkiList {
    nameGerman: string;
    originalHtml: string;
    blocked: 'total' | 'partial';
}
