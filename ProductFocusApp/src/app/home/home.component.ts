import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    //testing: is private api working...?
    // this.http.get("https://localhost:44388/api/WeatherForecast").subscribe(x =>{
    //   console.log(x);
    // })
  }

}
