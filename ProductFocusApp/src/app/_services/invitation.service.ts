import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from '../b2c-config';
import { IGetClosedInvitation, IGetPendingInvitation, IInvitationDetails, IInvitationInput, ISendInvitationInput, IUser } from '../dht-common/models';

@Injectable({
  providedIn: 'root',
})
export class InvitationService {
  constructor(private http: HttpClient) { }

  sendInvitation(sendInvitationInput: ISendInvitationInput) {
    return this.http.post(
      apiConfig.uri + '/Invitation/SendInvitation',
      sendInvitationInput
    ).pipe(
      catchError(this.handleError)
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
    ).pipe(
      catchError(this.handleError)
    );
  }

  getClosedInvitationList(
    orgid: number,
    offset: number,
    count: number
  ): Observable<IGetClosedInvitation> {
    return this.http.get<IGetClosedInvitation>(apiConfig.uri + `/Invitation/GetClosedInvitationList/${orgid}/${offset}/${count}`).pipe(
      catchError(this.handleError)
    );
  }

  cancelInvitation(cancel: IInvitationInput) {
    return this.http.post(
      apiConfig.uri + `/Invitation/CancelInvitation`,
      cancel
    ).pipe(
      catchError(this.handleError)
    );
  }

  acceptInvitation(accept: IInvitationInput) {
    return this.http.post(
      apiConfig.uri + `/Invitation/AcceptInvitation`,
      accept
    ).pipe(
      catchError(this.handleError)
    );
  }

  rejectInvitation(reject: IInvitationInput) {
    return this.http.post(
      apiConfig.uri + `/Invitation/RejectInvitation`,
      reject
    ).pipe(
      catchError(this.handleError)
    );
  }

  getUserListNotPartOfOrganization(orgid: number): Observable<IUser[]> {
    return this.http.get<IUser[]>(
      apiConfig.uri + `/Invitation/GetUserListNotPartOfOrganization/${orgid}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  getInvitationById(id: number): Observable<IInvitationDetails> {
    return this.http.get<IInvitationDetails>(
      apiConfig.uri + `/Invitation/GetInvitationDetailsById/${id}`
    ).pipe(
      catchError(this.handleError)
    )
  }

  handleError(error: HttpErrorResponse){
    return throwError(error);
  }
}
