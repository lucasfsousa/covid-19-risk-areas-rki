import main from "./main";
import {errors} from "./risk-areas";

main();

if (errors.length > 0) {
    console.error(`Hey you! Unfortunately we had some errors in the last import.

The page is automatically updated and sometimes it can stop working because of a change on RKI website.
Maybe you can help us creating a pull request in our Github:
https://github.com/lucasfsousa/covid-19-risk-areas-rki

Error list:
`);
    console.error(errors);
} else{
    console.log('Hi, thanks for checking the console, but everything was fine in the last deployment. :)');
}
