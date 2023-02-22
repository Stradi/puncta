import { HttpService } from '@nestjs/axios/dist/http.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class RevalidateService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async revalidateTeachers(slugs: string[]) {
    const paths = slugs.map((slug) => `/ogretmen/${slug}`);
    return this.revalidate(paths);
  }

  async revalidateUniversities(slugs: string[]) {
    const paths = slugs.map((slug) => `/universite/${slug}/degerlendirmeler`);
    return this.revalidate(paths);
  }

  async revalidate(paths: string[]) {
    const revalidateUrl = this.configService.get('REVALIDATE_URL');
    const revalidateToken = this.configService.get('REVALIDATE_SECRET');

    let fullUrl = `${revalidateUrl}?secret=${revalidateToken}`;
    for (const path of paths) {
      fullUrl += `&path=${path}`;
    }

    const { data } = await firstValueFrom(
      this.httpService.get(fullUrl).pipe(
        catchError((error: AxiosError) => {
          throw error;
        }),
      ),
    );

    return data;
  }
}
