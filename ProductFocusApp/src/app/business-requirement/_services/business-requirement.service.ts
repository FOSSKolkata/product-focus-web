import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from '../../b2c-config';
import {
  IBusinessRequirementAttachment,
  IBusinessRequirementDetails,
  IBusinessRequirementInput,
  IBusinessRequirements,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class BusinessRequirementService {
  constructor(private http: HttpClient) {}

  addBusinessRequirement(input: IBusinessRequirementInput): Observable<number> {
    return this.http
      .post<number>(
        apiConfig.uri + `/BusinessRequirement/AddBusinessRequirement`,
        input
      )
      .pipe(catchError(this.handleError));
  }

  deleteBusinessRequirement(id: number): Observable<void> {
    return this.http.delete<void>(
      apiConfig.uri + `/BusinessRequirement/DeleteBusinessRequirement/${id}`
    )
    .pipe(catchError(this.handleError));
  }

  getBusinessRequirementListByProductId(
    productId: number,
    tags: number[],
    startDate: Date,
    endDate: Date,
    offset: number,
    count: number
  ): Observable<IBusinessRequirements> {
    let tagParam = '';
    for (const tid of tags) {
      tagParam += `TagIds=${tid}&`;
    }
    tagParam = tagParam.substring(0, tagParam.length - 1);
    let options;
    if (startDate && endDate) {
      options = {
        params: new HttpParams({
          fromString: `StartDate=${startDate.toISOString()}&EndDate=${endDate.toISOString()}&${tagParam}`,
        }),
      };
    } else if (startDate) {
      options = {
        params: new HttpParams({
          fromString: `StartDate=${startDate.toISOString()}&${tagParam}`,
        }),
      };
    } else if (endDate) {
      options = {
        params: new HttpParams({
          fromString: `StartDate=${endDate.toISOString()}&${tagParam}`,
        }),
      };
    } else {
      options = { params: new HttpParams({ fromString: tagParam }) };
    }
    return this.http
      .get<IBusinessRequirements>(
        apiConfig.uri +
          `/BusinessRequirement/GetBusinessRequirementsByProductId/${productId}/${offset}/${count}/query`,
        options
      )
      .pipe(catchError(this.handleError));
  }

  getBusinessRequirementDetails(
    id: number
  ): Observable<IBusinessRequirementDetails> {
    return this.http
      .get<IBusinessRequirementDetails>(
        apiConfig.uri +
          `/BusinessRequirement/GetBusinessRequirementDetails/${id}`
      )
      .pipe(catchError(this.handleError));
  }

  updateBusinessRequirementDetails(
    businessRequirementDetails: IBusinessRequirementInput
  ): Observable<void> {
    return this.http
      .put<void>(
        apiConfig.uri + `/BusinessRequirement/UpdateBusinessRequirement`,
        businessRequirementDetails
      )
      .pipe(catchError(this.handleError));
  }

  uploadAttachments(formData: FormData, businessRequirementId: number) {
    return this.http.post(
      apiConfig.uri + `/BusinessRequirement/AddAttachments/${businessRequirementId}`,
      formData,
      { reportProgress: true, observe: 'events' }
    ).pipe(catchError(this.handleError));
  }

  getBusinessRequirementAttachments(businessRequirementId: number): Observable<IBusinessRequirementAttachment[]> {
    return this.http.get<IBusinessRequirementAttachment[]>(apiConfig.uri + `/BusinessRequirement/GetAttachmentsByBusinessRequirementId/${businessRequirementId}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteBusinessRequirementAttachments(businessRequirementId: number, attachmentId: number): Observable<void> {
    return this.http.delete<void>(apiConfig.uri + `/BusinessRequirement/DeleteBusinessRequirementAttachment/${businessRequirementId}/${attachmentId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
