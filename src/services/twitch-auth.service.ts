import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, tap } from 'rxjs';

@Injectable()
export class TwitchAuth {
  private readonly authUrl = 'https://id.twitch.tv/oauth2/token';
  private clientId: undefined;
  private clientSecret: undefined;
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    console.log('Starting TwitchAuthService');
    this.clientId = this.configService.get('CLIENT_ID');
    this.clientSecret = this.configService.get('CLIENT_SECRET');
    this.authenticate();
  }

  private authenticate() {
    return this.httpService
      .post(
        `${this.authUrl}?client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`,
      )
      .pipe(
        tap((response) => console.log('Recieved: ', response.data)),
        catchError((err: AxiosError) => {
          console.log('Error', err.response.data);
          throw 'An Error Occured!';
        }),
      );
  }
}
