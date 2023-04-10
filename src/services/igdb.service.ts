import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  concatMap,
  filter,
  iif,
  interval,
  map,
  switchMap,
  takeWhile,
  tap,
} from 'rxjs';
import { GenreService, IgdbGenre } from './genre.service';
import { Genre } from '@prisma/client';

type AuthResponseType = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

const readInterval$ = interval(500);

const QUERY_LIMIT = 500;

@Injectable()
export class IgdbService {
  private readonly authUrl = 'https://id.twitch.tv/oauth2/token';
  private readonly apiUrl = 'https://api.igdb.com/v4';

  private clientId: undefined;
  private clientSecret: undefined;

  private accessToken$ = new BehaviorSubject<string>(undefined);

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private genreService: GenreService,
  ) {
    console.log('Starting TwitchAuthService');
    this.clientId = this.configService.get('CLIENT_ID');
    this.clientSecret = this.configService.get('CLIENT_SECRET');
    this.getAuthToken$().subscribe({
      next: ({ access_token }) => {
        this.accessToken$.next(access_token);
      },
      error: console.error,
    });

    this.accessToken$
      .pipe(
        filter((value) => !!value),
        switchMap((token) =>
          readInterval$.pipe(
            concatMap((i) => {
              return iif(
                () => !!token,
                this.getGenres(i * QUERY_LIMIT, QUERY_LIMIT),
                EMPTY,
              );
            }),
          ),
        ),
        map((value: IgdbGenre[]) =>
          value.map(
            (item) =>
              ({
                igdb_id: item.id,
                name: item.name,
                slug: item.slug,
              } as Genre),
          ),
        ),
        takeWhile((data) => data.length > 0),
      )
      .subscribe({
        next: (data) => this.genreService.createGenres(data),
        complete: () => console.log('Finished Adding Genres'),
      });
  }

  public getAuthToken$(): Observable<AuthResponseType> {
    return this.httpService
      .post(
        `${this.authUrl}?client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`,
      )
      .pipe(
        // tap((data) => console.log(data.data)),
        map((response) => response?.data),
        catchError((err: any) => {
          console.log('Error', err.response.data);
          throw 'An Error Occured!';
        }),
      );
  }

  private getGenres = (offset = 0, limit = 5) => {
    const body = `fields *; limit ${limit}; offset ${offset}; sort id asc;`;
    return this.httpService
      .post(`${this.apiUrl}/genres`, body, {
        headers: {
          Authorization: `Bearer ${this.accessToken$.value}`,
          'Client-ID': this.clientId,
        },
      })
      .pipe(
        // tap((response) => console.log(response.data)),
        map((response) => response.data as IgdbGenre[]),
      );
  };
}
