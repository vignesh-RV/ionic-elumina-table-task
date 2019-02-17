import { Injectable } from "@angular/core";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { TableData } from '../models/tabledata';
import { Subject } from 'rxjs';
import { constants } from '../constants/constants';


@Injectable({
    providedIn: "root"
})
export class DBService{
    db:SQLiteObject;
    isDatabaseReady = new Subject();
    constructor(private sqlite: SQLite){
        this.initTables();
    }

    initTables(){
        this.sqlite.create({
            name: constants.database.name,
            location: constants.database.location
          }).then((db: SQLiteObject) => {
            this.db = db; 
            db.executeSql('CREATE TABLE IF NOT EXISTS tables(id INTEGER PRIMARY KEY, name STRING, rowcount INT, columncount INT, data TEXT)')
            .then(res => console.log("DataBaseInitialized"))
            .catch(e => console.log(e));
            this.isDatabaseReady.next(true);
          })
          .catch(e => console.log(e));
    }

    getAllTableData() {
        return new Promise((resolve, reject)=>{
            // this.sqlite.create({
            //     name: 'ionicdb.db',
            //     location: 'default'
            //   }).then((db: SQLiteObject) => {
                this.db.executeSql('SELECT * FROM tables', [])
                .then(res => {
                console.log(res);
                resolve(this.getData(res.rows));
                })
                .catch(e => {
                    console.log(e);
                    reject(this.getData(e.rows));
                });
            });
        // });
    }

    getData(rows:any): any{
      var result = [];
      for(var i=0; i<rows.length; i++) {
        var temp = {}, currentItem = rows.item(i);
        if(currentItem){
            Object.keys(currentItem).forEach(key => {
                temp[key] = key == "id" ? currentItem[key] : this.getDecodedData(currentItem[key]);
            }); 
            if(currentItem) result.push( temp );
        }
      }
      return result;
    }

    getEncodedData(data): any{
        return data ? btoa( JSON.stringify(data) ) : data;
    }

    getDecodedData(data): any{
        return data ? JSON.parse( atob( data ) ) : data;
    }

    addNewData(data:TableData) {
        return new Promise((resolve, reject)=>{
            this.db.executeSql('INSERT INTO tables (rowcount, columncount, data, name) VALUES (?, ?, ?, ?)', 
            [this.getEncodedData(data.rowcount), this.getEncodedData(data.columncount), this.getEncodedData(data.data), this.getEncodedData(data.name) ])
            .then(res => {
            console.log(res);
            resolve(res);
            })
            .catch(e => {
                console.log(e);
                reject(e);
            });
        });
    }


    deleteTableData(tableId:number) {
        return new Promise((resolve, reject)=>{
            this.db.executeSql('DELETE FROM tables WHERE id = ?', [tableId])
            .then(res => {
            console.log(res);
            resolve(res);
            })
            .catch(e => {
                console.log(e);
                reject(e);
            });
        });
    }
}