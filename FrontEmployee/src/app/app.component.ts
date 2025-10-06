import { Component,ViewChild,AfterViewInit,inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';
import { MatIconButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit {

  title="EmployeeData";
  tablesData: any;
  selectedTrainee: any;
  id: any;

  constructor( private apiService: DataService,private datepipe:DatePipe,private dialog: MatDialog){}

  displayedColumns: string[] = ['name', 'email', 'position','mobile','gender','dob','Action'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    
  }

  studentForm = new FormGroup({
    name: new FormControl('', [Validators.required, ]),
    mobile_number: new FormControl('', [Validators.required,Validators.pattern('^[6-9]\\d{9}$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    position: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    DOB: new FormControl('',[Validators.required])
    

  });

  ngOnInit(){
   this.getTable();
  }

//Get Employee Data
  getTable(){
    this.apiService.getData('employee').subscribe(response=>{
      console.log('table',response);
      this.tablesData=response;
      this.dataSource.data=this.tablesData;
    })
  }



//Edit Employee Form
onEdit(id: any) { 
  // Find the selected trainee data
  this.selectedTrainee = this.tablesData.find((t: any) => t._id === id); 
  this.getTable();
  console.log("Editing Trainee:", this.selectedTrainee);

 
  if (this.selectedTrainee) {
    this.id = id;
  const [day, month, year] = this.selectedTrainee.DOB.split('-');
  const date = new Date(+year, +month - 1, +day);
    // Patch form values
    this.studentForm.patchValue({
      name: this.selectedTrainee.name,
      mobile_number: this.selectedTrainee.mobile_number, // Might need formatting if coming as timestamp
      email: this.selectedTrainee.email,
      gender: this.selectedTrainee.gender,
      position: this.selectedTrainee.position,
      DOB:this.datepipe.transform(date, 'yyyy-MM-dd')
    });


    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      width: '90vh',
      data: {isEdit:true,employeeData:this.selectedTrainee}   // passing data here
    });

    // Get back data when dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      this.getTable();
    });
  }
}



//Delete Employee data Row
async onDelete(id:any){
     const confirmed =  await Swal.fire({
    title: 'Are you sure?',
    text: "Are you sure you want to delete this data?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  });
  if (!confirmed.isConfirmed) return;
    
      this.apiService.deleteData('employee/' + id).subscribe({
        next: (res) => {
          console.log('Delete response:', res);
         // alert("Data deleted successfully.");
                Swal.fire({
                  icon: "success",
                  text: "Data Delete successfully.", 
                  timer: 2000
                });
          this.getTable();
        },
        error: (err) => {
          console.error("Delete failed", err);
                Swal.fire({
                  icon: "error",
                  text: "Failed to delete Data.", 
                  timer: 2000
                });
        }
        
      });
       this.getTable();
}
  isHidden = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  openDialog() {

    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      width: '90vh',
      data: {isEdit:false}   // passing data here
    });

    // Get back data when dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      this.getTable();
    });
  }
}




