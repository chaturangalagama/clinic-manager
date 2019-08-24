import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PolicyHolderService {
  constructor(private http: HttpClient) {}
}
