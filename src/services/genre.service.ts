import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Genre, Prisma } from '@prisma/client';

Injectable();
export class GenreService {
  constructor(private prisma: PrismaService) {
    console.log('Starting GenreService');
  }

  async genre(
    genreWhereUniqueInput: Prisma.GenreWhereUniqueInput,
  ): Promise<Genre | null> {
    return this.prisma.genre.findUnique({ where: genreWhereUniqueInput });
  }

  async genres(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.GenreWhereUniqueInput;
    where?: Prisma.GenreWhereInput;
    orderBy?: Prisma.GenreOrderByWithRelationInput;
  }): Promise<Genre[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.genre.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createGenre(data: Prisma.GenreCreateInput): Promise<Genre> {
    return this.prisma.genre.create({
      data,
    });
  }

  async updateGenre(params: {
    where: Prisma.GenreWhereUniqueInput;
    data: Prisma.GenreUpdateInput;
  }): Promise<Genre> {
    const { where, data } = params;
    return this.prisma.genre.update({
      data,
      where,
    });
  }

  async deleteGenre(where: Prisma.GenreWhereUniqueInput): Promise<Genre> {
    return this.prisma.genre.delete({
      where,
    });
  }
}
