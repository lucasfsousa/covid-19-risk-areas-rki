import getCountriesMetadata from "./get-countries-metadata";
import getRkiList from "./get-rki-list";

/**
 * This function will combine both functions `getRkiList` and `getCountriesMetadata`.
 * For each area inside the `rkiList`, the function will enrich it with iso-alpha-code.
 * If the area doesn't exist, an error message will be printed and the area will be ignored.
 */
export default async (): Promise<RiskArea[]> => {
    const countriesMetadata = await getCountriesMetadata();
    const rkiList = await getRkiList();

    return rkiList.map(area => {
        const country = countriesMetadata.find(it => it.name_de == area.nameGerman);
        if (!country) {
            console.error(`Could not find country named ${area.nameGerman}`);
            return null;
        }
        return {
            isoAlpha3: country.iso_alpha_3,
            originalHtml: area.originalHtml,
            blocked: area.blocked,
        }
    }).filter(area => area != null);
}

interface RiskArea {
    isoAlpha3: string;
    originalHtml: string;
    blocked: 'total' | 'partial';
}
