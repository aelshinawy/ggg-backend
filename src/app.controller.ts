import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GenreService } from './services/genre.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly genreService: GenreService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
