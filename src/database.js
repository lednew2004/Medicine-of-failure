import fs from "node:fs/promises";
const databasePath = new URL("../db.json", import.meta.url);

export class Database {
    #database = {};

    constructor(){
        fs.readFile(databasePath, "utf8").then(data => {
            this.#database = JSON.parse(data);
        }).catch(() => {
            this.#persist()
        })
    }

    #persist(){
        fs.writeFile(databasePath, JSON.stringify(this.#database));
    }

    select(table, search){
        let data = this.#database[table] ?? [];

        if(search){
            data = data.filter(row => {
                return Object.entries(search).some(([ key, value ]) => {
                    if(!value) return true
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }
        return data
    }

    insert(table, data){
        if(Array.isArray(this.#database[table])){
            this.#database[table].push(data);
        }else{
            this.#database[table] = [data];
        };

        this.#persist()
        return data;
    };

    
        update(table, search, data){
            const rowIndex = this.#database[table].findIndex(row => {
                return row.medicine === search
            })
    
            if(rowIndex > -1){
                const row = this.#database[table][rowIndex]
                this.#database[table][rowIndex]= {...row, ...data}
                this.#persist()
            }
    }
};