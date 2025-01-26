import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-search-car',
  templateUrl: './search-car.component.html',
  styleUrls: ['./search-car.component.css']
})
export class SearchCarComponent {

  cars: any = [];
  isSpinning = false;
  validateForm: FormGroup;
  listOfBrands = ["BMW", "AUDI", "FERRARI", "TESLA", "VOLVO", "TOYOTA", "HONDA", "FORD", "NISSAN", "HYUNDAI", "LEXUS", "KIA"];
  listOfType = ["Petrol", "Hybrid", "Diesel", "Electric", "CNG"];
  listOfColor = ["Red", "White", "Blue", "Black", "Orange", "Grey", "Silver"];
  listOfTransmission = ["Manual", "Automatic"];

  constructor(private fb: FormBuilder,
    private customerService: CustomerService) {
    this.validateForm = this.fb.group({
      brand: [null],
      type: [null],
      color: [null],
      transmission: [null]
    });
  }

  searchCar() {
    this.isSpinning = true;
    this.cars = []; // Clear the previous search results
    this.customerService.searchCar(this.validateForm.value).subscribe((res) => {
      this.isSpinning = false;
      console.log(res);
      res.carDtoList.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.returnedImage;
        this.cars.push(element); // Add new search results
      });
    });
  }
}