import { Component,Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef,MatDialog } from '@angular/material/dialog';
import { MatDialogActions } from '@angular/material/dialog';
import { AppComponent } from '../app.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss'
})
export class AddEmployeeComponent {
  dialogTitle='Add Employee Data'
  id:any;
ngOnInit(){
  if(this.data.isEdit==true){
    this.hideButton();
    let d=this.data.employeeData;
    this.id = d._id;
  const [day, month, year] = d.DOB.split('-');
  const date = new Date(+year, +month - 1, +day);
    this.studentForm.patchValue({
      name: d.name,
      mobile_number: d.mobile_number, // Might need formatting if coming as timestamp
      email: d.email,
      gender: d.gender,
      position: d.position,
      DOB:this.datepipe.transform(date, 'yyyy-MM-dd')
    })

  }
}


  isHidden = false;
  onSubmitHidden=false;
  onUpdateHidden=true;
    constructor( private apiService: DataService,private datepipe:DatePipe, public dialogRef: MatDialogRef<AppComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){}
  
    studentForm = new FormGroup({
      name: new FormControl('', [Validators.required, ]),
      mobile_number: new FormControl('', [Validators.required,Validators.pattern('^[6-9]\\d{9}$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      position: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      DOB: new FormControl('',[Validators.required])
      
  
    });

   onSubmit() {
      console.log(this.studentForm.value);
  
       if (this.studentForm.invalid) {
       Swal.fire({
                icon: "error",
                text: "Please fill out the form correctly.", 
                timer: 5000
              });
      return;
    }
      this.apiService.postData('employee', this.studentForm.value).subscribe((res: any) => {
        if (res)
          alert("Data saved succesfully..");
            this.onClear();
          
      });
    }
  
   //Reset Form 
  onClear(){
    this.studentForm.reset();
    this.visibleButton();
  }

  onUpdate() {
  this.apiService.putData('employee/' + this.id, this.studentForm.value).subscribe((res: any) => {
    if (res) {
      alert("Data updated successfully!");
    }

    // Refresh table and reset form
    
    this.onClear();
    this.visibleButton();
    this.close()
  });

}

hideButton() {
    this.onSubmitHidden = true;
    this.onUpdateHidden = false;
  }

visibleButton() {
    this.onSubmitHidden = false;
    this.onUpdateHidden = true;
  }

    close() {
    this.dialogRef.close("Dialog closed!");
  }
}
