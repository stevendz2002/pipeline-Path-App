import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ZoneDetail, ZoneListResponse } from '../models/zone.model';

@Injectable({ providedIn: 'root' })
export class ZoneService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://pokeapi.co/api/v2/pokemon-habitat';

  getZones(): Observable<ZoneListResponse> {
    return this.http.get<ZoneListResponse>(this.apiUrl);
  }

  getZoneDetail(nameOrId: string | number): Observable<ZoneDetail> {
    return this.http.get<ZoneDetail>(`${this.apiUrl}/${nameOrId}`);
  }
}
