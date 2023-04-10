import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosResponse } from 'axios';
import { response } from 'express';
import { Observable, catchError, map, tap } from 'rxjs';

type AuthResponseType = {
  access_token: string;
  expires_in: number;
  token_type: string;
};
@Injectable()
export class TwitchAuth {
  private readonly authUrl = 'https://id.twitch.tv/oauth2/token';
  private clientId: undefined;
  private clientSecret: undefined;

  //access_token: '4cmsg7cyfi61pkahxuc6e8mll175zo',
  //expires_in: 4885272,
  //token_type: 'bearer'
  private timeout: number;
  private token: string;
  private type: string;
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    console.log('Starting TwitchAuthService');
    this.clientId = this.configService.get('CLIENT_ID');
    this.clientSecret = this.configService.get('CLIENT_SECRET');
    this.getAuthToken$().subscribe({ next: console.log });
  }

  public getAuthToken$(): Observable<
    AuthResponseType | AxiosResponse<any, any>
  > {
    return this.httpService
      .post(
        `${this.authUrl}?client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`,
      )
      .pipe(
        map((response) => response?.data),
        catchError((err: AxiosError) => {
          console.log('Error', err.response.data);
          throw 'An Error Occured!';
        }),
      );
  }
}
