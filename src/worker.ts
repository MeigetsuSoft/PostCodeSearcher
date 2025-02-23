import { readdirSync, statSync } from 'fs';
import { readDataFromCSV, readDataFromJson } from './read';
import { PostCodeRecord } from './PostCodeRecord';

export default class Worker {
    private Record: PostCodeRecord<number, string>[];
    constructor(prefecture: string) {
        this.Record = readDataFromJson(`./postcodes/master/${prefecture}.json`);
        readdirSync(`./postcodes/patch`)
            .map(dir => `./postcodes/patch/${dir}`)
            .filter(i => statSync(i).isDirectory())
            .sort()
            .forEach(dir => {
                const AddRecordReadResult = readDataFromCSV(dir + '/ADD.CSV').filter(i => i.prefecture === prefecture);
                const DelRecordReadResult = readDataFromCSV(dir + '/DEL.CSV').filter(i => i.prefecture === prefecture);
                const data = {
                    new: AddRecordReadResult.filter(
                        i => DelRecordReadResult.findIndex(j => j.postcode === i.postcode) === -1
                    ),
                    del: DelRecordReadResult.filter(
                        i => AddRecordReadResult.findIndex(j => j.postcode === i.postcode) === -1
                    ),
                    update: AddRecordReadResult.filter(
                        i => DelRecordReadResult.findIndex(j => j.postcode === i.postcode) !== -1
                    ),
                };
                data.new.forEach(i => {
                    this.Record.push({
                        ...i,
                        id: this.Record.length,
                    });
                });
                data.del
                    .filter(i => i.prefecture === prefecture)
                    .forEach(i => {
                        const index = this.Record.findIndex(j => j.postcode === i.postcode);
                        if (index !== -1) this.Record.splice(index, 1);
                    });
                data.update.forEach(i => {
                    const index = this.Record.findIndex(j => j.postcode === i.postcode);
                    if (index !== -1)
                        this.Record[index] = {
                            ...i,
                            id: index,
                        };
                });
            });
    }
    public get(postcode: string) {
        if (!/^\d{3}-?\d{4}$/.test(postcode)) return { postcode: postcode };
        const Index = this.Record.findIndex(i => i.postcode === postcode.replace('-', ''));
        return Index === -1 ? { postcode: postcode } : { ...this.Record[Index], postcode: postcode };
    }
    [Symbol.iterator]() {
        return this.Record[Symbol.iterator]();
    }
}
