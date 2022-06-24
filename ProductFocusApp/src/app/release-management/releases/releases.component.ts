import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { ICreateOrUpdateRelease, IRelease } from 'src/app/dht-common/models';
import { ReleaseService } from 'src/app/_services/release.service';

@Component({
  selector: 'app-releases',
  templateUrl: './releases.component.html',
  styleUrls: ['./releases.component.scss']
})
export class ReleasesComponent implements OnInit, OnDestroy {

  release: ICreateOrUpdateRelease = {
    id: null,
    name: '',
    releaseDate: null
  }
  releases: IRelease[] = [];
  productId: number;
  adding = false;

  constructor(private releaseService: ReleaseService,
    private route: ActivatedRoute,
    private tostr: ToastrService,
    private modalService: NgbModal) {
      this.productId = this.route.snapshot.params['id'];
    }

  ngOnInit(): void {
    this.getReleases();
  }

  getReleases() {
    this.releaseService.getReleasesByProductId(this.productId).subscribe(x => {
      this.releases = x;
    }, err => {
      this.tostr.error(err.error, 'Failed');
    })
  }

  createOrUpdateRelease(form: NgForm) {
    this.adding = true;
    if(!!this.release.id) {
      this.updateRelease(form);
    } else {
      this.createRelease(form);
    }
  }

  updateRelease(form: NgForm) {
    this.releaseService.updateRelease(this.release)
      .pipe(
        finalize(() => {
          this.adding = false;
        })
      ).subscribe(x => {
        form.reset();
        this.getReleases();
        this.tostr.success('Release Updated', 'Success');
      }, err => {
        this.tostr.error(err.error, 'Failed');
      })
  }

  createRelease(form: NgForm) {
    this.releaseService.createRelease(this.productId, this.release).pipe(
      finalize(() => {
        this.adding = false;
      })
    ).subscribe(x => {
      form.reset();
      this.getReleases();
      this.tostr.success('Release created', 'Success');
      this.modalService.dismissAll();
    }, err => {
      this.tostr.error(err.error, 'Failed');
    });
  }


  open(content: any, release: ICreateOrUpdateRelease | null = null) {
    if(release != null) {
      this.release = release;
    } else {
      this.release = {
        id: null,
        name: '',
        releaseDate: null
      }
    }
    this.modalService.open(content, {ariaLabelledBy: 'Release', centered: true}).result.then(() => {}, () => {});
  }

  
  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }
}