import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { Release } from '../model';
import { ReleaseService } from '../_services/release.service';

@Component({
  selector: 'app-releases',
  templateUrl: './releases.component.html',
  styleUrls: ['./releases.component.scss']
})
export class ReleasesComponent implements OnInit {

  release: Release = {
    name: '',
    releaseDate: new Date()
  }
  productId: number;
  adding = false;

  constructor(private releaseService: ReleaseService,
    private route: ActivatedRoute,
    private tostr: ToastrService) {
      this.productId = this.route.snapshot.params['id'];
    }

  ngOnInit(): void {
  }

  createRelease(form: NgForm) {
    this.adding = true;
    this.releaseService.createRelease(this.productId, this.release).pipe(
      finalize(() => {
        this.adding = false;
      })
    ).subscribe(x => {
      form.reset();
      this.tostr.success('Release created', 'Success');
    }, err => {
      this.tostr.error(err.error, 'Failed');
    });
  }
}