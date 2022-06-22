import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { ICreateRelease, IRelease } from 'src/app/dht-common/models';
import { ReleaseService } from 'src/app/_services/release.service';
import { Release } from '../model';
// import { ReleaseService } from '../_services/release.service';

@Component({
  selector: 'app-releases',
  templateUrl: './releases.component.html',
  styleUrls: ['./releases.component.scss']
})
export class ReleasesComponent implements OnInit {

  release: ICreateRelease = {
    name: '',
    releaseDate: new Date()
  }
  releases: IRelease[] = [];
  productId: number;
  adding = false;

  constructor(private releaseService: ReleaseService,
    private route: ActivatedRoute,
    private tostr: ToastrService) {
      this.productId = this.route.snapshot.params['id'];
    }

  ngOnInit(): void {
    this.getReleases();
  }

  getReleases() {
    this.releaseService.getReleasesByProductId(this.productId).subscribe(x => {
      this.releases = x;
    }, err => {
      this.tostr.error('Something went wrong', 'Failed');
    })
  }

  createRelease(form: NgForm) {
    this.adding = true;
    this.releaseService.createRelease(this.productId, this.release).pipe(
      finalize(() => {
        this.adding = false;
      })
    ).subscribe(x => {
      form.reset();
      this.getReleases();
      this.tostr.success('Release created', 'Success');
    }, err => {
      this.tostr.error(err.error, 'Failed');
    });
  }
}