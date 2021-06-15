import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiConfig } from '../b2c-config';
import { IGetClosedInvitation, IGetPendingInvitation, IInvitationInput, ISendInvitationInput, IUser } from '../dht-common/models';

@Injectable({
  providedIn: 'root',
})
export class InvitationService {
  constructor(private http: HttpClient) { }

  sendInvitation(sendInvitationInput: ISendInvitationInput) {
    return this.http.post(
      apiConfig.uri + '/Invitation/SendInvitation',
      sendInvitationInput
    );
  }

  getPendingInvitationList(
    orgid: number,
    offset: number,
    count: number
  ): Observable<IGetPendingInvitation> {
    return this.http.get<IGetPendingInvitation>(
      apiConfig.uri +
      `/Invitation/GetPendingInvitationList/${orgid}/${offset}/${count}`
    );
  }

  getClosedInvitationList(
    orgid: number,
    offset: number,
    count: number
  ): Observable<IGetClosedInvitation> {
    return this.http.get<IGetClosedInvitation>(apiConfig.uri + `/Invitation/GetClosedInvitationList/${orgid}/${offset}/${count}`);
  }

  cancelInvitation(cancel: IInvitationInput) {
    return this.http.post(
      apiConfig.uri + `/Invitation/CancelInvitation`,
      cancel
    );
  }

  acceptInvitation(accept: IInvitationInput) {
    return this.http.post(
      apiConfig.uri + `/Invitation/AcceptInvitation`,
      accept
    );
  }

  rejectInvitation(reject: IInvitationInput) {
    return this.http.post(
      apiConfig.uri + `/Invitation/RejectInvitation`,
      reject
    );
  }

  getUserListNotPartOfOrganization(orgid: number): Observable<IUser[]> {
    return this.http.get<IUser[]>(
      apiConfig.uri + `/Invitation/GetUserListNotPartOfOrganization/${orgid}`
    );
  }
}
