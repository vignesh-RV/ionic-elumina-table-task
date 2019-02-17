import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TableData } from '../../models/tabledata';
import { DBService } from '../../services/db-service';
import { ToastController } from '@ionic/angular';
import { constants } from '../../constants/constants';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tableForm: FormGroup;
  tableData: TableData;
  allTables:TableData[];
  showTable: boolean = false;

  constructor(private dbService: DBService, private toast: ToastController){
  }

  ngOnInit(): any{
    this.tableForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      rowcount: new FormControl("", [Validators.required, Validators.pattern(/^\d+$/)]),
      columncount: new FormControl("", [Validators.required,  Validators.pattern(/^\d+$/)])
    });

    this.dbService.isDatabaseReady.subscribe((isReady: boolean)=>{
      if(isReady){
        this.getAllSavedTables();
      }
    });
  }

  getAllSavedTables(): any{
    this.dbService.getAllTableData().then((response: TableData[])=>{
      this.allTables = response;
      console.dir(response);
    });
  }

  createTable(): any{
    this.tableData = this.tableForm.getRawValue();
    this.showTable = true;
  }

  saveTable(): any{
    console.log("adding data=>" + this.tableData);
    console.dir(this.tableData);
    
    this.dbService.addNewData(this.tableData).then((res)=>{
      if(res){
        this.getAllSavedTables();
        this.showTable = false;
        this.showMessage('Saved Sucessfully', 1);
      }
    }, ()=>{
      this.showMessage('Please try again later', 2);
    });
  }

  deleteTable(data: TableData): any{
    this.dbService.deleteTableData(data.id).then((res)=>{
      if(res){
        this.getAllSavedTables();
       this.showMessage('Deleted Sucessfully');
      }
    });
  }

  showMessage(message: string, type?: number): any{
    this.toast.create({
      message: message,
      duration: constants.toaster.duration,
      color : type == 2 ? "danger" : "success"
    }).then((toast)=>{
      toast.present();
    });
  }
}
