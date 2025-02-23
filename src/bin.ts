#!/usr/bin/env node
import commandLineArgs from 'command-line-args';
import { readDataFromCSV } from './read';
import { writeJson } from 'nodeeasyfileio';
import PostCodeDataLoader from './index';

const options = commandLineArgs([
    { name: 'init', alias: 'i', type: Boolean },
    { name: 'master-csv-path', alias: 'm', type: String, defaultValue: 'KEN_ALL.CSV' },
    { name: 'search-postcode', alias: 'p', type: Boolean },
    { name: 'postcode', type: String },
]);

if (options['init']) {
    if (!options['master-csv-path']) throw new Error('master-csv-path is required');
    const MasterCSV = readDataFromCSV(options['master-csv-path']);
    const Prefectures = MasterCSV.map(i => i[6]).filter((x, i, self) => self.indexOf(x) === i);
    Prefectures.forEach(prefecture => {
        const Records = MasterCSV.filter(i => i[6] === prefecture);
        writeJson(`./postcodes/master/${prefecture}.json`, { postcodes: Records });
    });
}
else if (options['search-postcode']) {
    const SearchEngine = new PostCodeDataLoader();
    const result = SearchEngine.get(options['postcode']);
    if ('prefecture' in result) console.log(`${result.prefecture}${result.city}${result.address}`);
    else console.log('この郵便番号は存在しません');
}
