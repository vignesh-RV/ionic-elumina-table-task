import { Component, Input, EventEmitter, Output } from '@angular/core';
import { TableData } from '../../models/tabledata';

@Component({
  selector: 'dynamic-table',
  templateUrl: 'dynamic-table.html',
  styleUrls: ['dynamic-table.scss'],
})
export class DynamicTable {

  _tableData: TableData;
  get tableData(): TableData {
      return this._tableData;
  }

  @Input('tableData')
  set tableData(value: TableData) {
      if(!value) value = new TableData();
      if(value && !value.data){
        value.data = {};
      }

      this._tableData = value;
  }
  
  @Input() editMode : boolean = false;
  @Output('saveTable') saveDataIntoTable:EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): any{
    
  }

  getArrayFromCount(arrayLength: any): any[]{
    return arrayLength ? Array.from( new Array(parseInt(arrayLength)).keys() ) : [];
  }

  setData(evt: any, rowIndex: number, columnIndex: number): any{
    if(!this.tableData.data[rowIndex]){
      this.tableData.data[rowIndex] = {};
    }
    this.tableData.data[rowIndex][columnIndex] = evt.target.value;
    console.log(this.tableData.data);
  }

  getData(rowIndex: number, columnIndex: number): any{
    return ( (this.tableData && this.tableData.data[rowIndex]) ? this.tableData.data[rowIndex][columnIndex] : "");
  }

  saveTable(): any{
    this.saveDataIntoTable.emit();
  }
}
