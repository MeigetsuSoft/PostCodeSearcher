#!/usr/bin/env node
import commandLineArgs from 'command-line-args';
import { readDataFromCSV } from './read';
import { writeFile, writeJson } from 'nodeeasyfileio';
import PostCodeDataLoader from './index';

const options = commandLineArgs([
    { name: 'init-package', alias: 'i', type: Boolean },
    { name: 'master-csv-path', alias: 'm', type: String, defaultValue: 'KEN_ALL.CSV' },
    { name: 'search', alias: 's', type: String },
    { name: 'help', alias: 'h', type: Boolean },
]);

if (options['init-package']) {
    if (!options['master-csv-path']) throw new Error('master-csv-path is required');
    const MasterCSV = readDataFromCSV(options['master-csv-path']);
    const Prefectures = MasterCSV.map(i => i.prefecture).filter((x, i, self) => self.indexOf(x) === i);
    Prefectures.forEach(prefecture => {
        const Records = MasterCSV.filter(i => i.prefecture === prefecture);
        writeJson(`./postcodes/master/${prefecture}.json`, { postcodes: Records });
    });
    writeFile('./postcodes/master/data.txt', new Date().toLocaleString());
    console.log('初期化が完了しました。');
} else if (options['search']) {
    const SearchEngine = new PostCodeDataLoader();
    const results = SearchEngine.get(options['search']);
    if ('postcode' in results) console.log('この郵便番号は存在しません');
    else {
        results.forEach(result => {
            console.log(`${result.prefecture}${result.city}${result.address}`);
        });
    }
} else {
    if (!options['help']) console.log('Command line arguments are required.');
    console.log('Usage: postcode -i --master-csv-path <path>');
    console.log('       postcode -p <postcode>');
}
