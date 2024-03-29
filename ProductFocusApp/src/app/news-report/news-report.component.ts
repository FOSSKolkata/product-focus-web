import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { EventLogService } from '../_services/event-log.service';
import * as moment from 'moment';
import { EventLog, IMemberDetailsList, IOrganization } from '../dht-common/models';
import { UserService } from '../_services/user.service';
import { ProductService } from '../_services/product.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DateFunctionService } from '../dht-common/date-function.service';
import { finalize } from 'rxjs/operators';
import { OrganizationService } from '../_services/organization.service';
import { ModuleService } from '../_services/module.service';

@Component({
  selector: 'app-news-report',
  templateUrl: './news-report.component.html',
  styleUrls: ['./news-report.component.scss'],
})
export class NewsReportComponent implements OnInit {
  selected = 'All';
  selectedProduct!: { id: number; name: string; };
  selectedOrganization! : IOrganization;
  eventList: EventLog[] = [];
  userList: any[] = [];
  selectedUsers: any[] = [];
  moduleList: any[] = [];
  selectedModules: any[] = [];
  selectedModuleIds: number[] = [];
  selectedUserIds: number[] = [];
  fromDate!: NgbDate;
  toDate!: NgbDate;
  recordOffset = 0;
  count = 5;
  dropdownSettings: IDropdownSettings = {};
  titleExpanded = false;
  loading = false;
  constructor(private eventLogService: EventLogService,
    private userService: UserService,
    private productService: ProductService,
    private dateService: DateFunctionService,
    private route: ActivatedRoute,
    private organizationService: OrganizationService,
    private moduleService: ModuleService
  ) { }

  async ngOnInit(): Promise<void> {
    let organizationName = this.route.snapshot.parent?.parent?.params["organizationName"];
    let productId = this.route.snapshot.params['id'];
    this.selectedOrganization = await this.organizationService.getOrganizationByName(organizationName).toPromise();
    this.selectedProduct = await this.productService.getById(productId).toPromise();

    this.moduleService.getModulesByProductId(this.selectedProduct.id).subscribe(res => {
      this.moduleList = res;
      this.moduleList.map((module) => {
        module.item_id = module.id;
        module.item_text = module.name;
        return module;
      });
    })

    this.userService.getUserListByOrganization(this.selectedOrganization.id).subscribe((res: IMemberDetailsList)  => {
      this.userList = res.members;
      this.userList.map((member) => {
        member.item_id = member.id;
        member.item_text = member.name;
        return member;
      });
    });
    
    this.fetchNextLogs();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };
  }
  // Filter by date
  selectDate(event: any, type: string) {
    if(type === 'start') {
      this.fromDate = event;
    } else {
      this.toDate = event;
    }
    if(!!this.fromDate && !!this.toDate) {
      this.recordOffset = 0;
      this.eventList = [];
      this.fetchNextLogs();
    }
  }
  // Filter by Owner
  OnChangeOwnerFilter() {
    this.recordOffset = 0;
    this.eventList = [];
    this.selectedUserIds = [];
    for(let user of this.selectedUsers) {
      this.selectedUserIds.push(user.item_id);
    }
    this.fetchNextLogs();
  }

  // Filter by Module
  OnChangeModuleFilter() {
    this.recordOffset = 0;
    this.eventList = [];
    this.selectedModuleIds = [];
    for(let module of this.selectedModules) {
      this.selectedModuleIds.push(module.item_id);
    }
    this.fetchNextLogs();
  }
  
  onEventChange(type: string) {
    this.recordOffset = 0;
    this.eventList = [];
    this.fetchNextLogs();
  }

  onScroll() {
    this.fetchNextLogs();
  }

  fetchNextLogs() {
    let fromDate: Date | undefined = undefined, toDate: Date | undefined = undefined;
    if(this.fromDate !== undefined) {
      fromDate = this.dateService.ngbDateToDate(this.fromDate);
    }

    if(this.toDate !== undefined) {
      toDate = this.dateService.ngbDateToDate(this.toDate);
    }

    let eventType = this.selected == 'All'? null : this.selected;

    this.loading = true;
    this.eventLogService.getEventLog(this.selectedProduct.id, this.recordOffset, this.count, this.selectedModuleIds,
      this.selectedUserIds, fromDate, toDate, eventType).pipe(
        finalize(() => {
          this.loading = false;
        })
      ).subscribe((res: any) => {
      this.recordOffset += this.count;
      res.map((item: any) => {
        item.domainEventJson = JSON.parse(item.domainEventJson);
        item.createdOn = moment.utc(item.createdOn).local().toDate();
        return item;
      });
      for(let curr of res) {
        this.eventList.push(curr);
      }
    });
  }
}
