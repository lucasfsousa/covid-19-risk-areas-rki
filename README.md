# What is this project

[© Robert Koch-Institut](https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Risikogebiete_neu.html) has a page that lists all the international risk areas,
this list is useful to everyone living in Germany, but it's not easy to see which countries are present or not in this list.

This project wants to present the same information in a map, so it will be easier to get this information. 

This project is not related by any means with the German government and do not replace the list from [RKI](https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Risikogebiete_neu.html).

# How the information is updated?
TBD

# How to test it locally?
TBD

# External libraries

- [axios](https://github.com/axios/axios) to download RKI page
- [CheerioJS](https://github.com/cheeriojs/cheerio) to scrap RKI website
- [Openlayer](https://github.com/openlayers/openlayers) to display the map
- [Parcel](https://github.com/parcel-bundler/parcel) to run locally & build

# External data

- [countries.geojson](https://github.com/mikekeda/maps/blob/master/geojson/world.geojson) to plot the map
- [generate/data/world-countries-iso.csv](https://github.com/sueddeutsche/sz-data/blob/master/world-countries/world-countries-iso) to map iso-code-3 and get countries english names
