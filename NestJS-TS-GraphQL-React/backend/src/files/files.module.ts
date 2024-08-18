import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesResolver } from './files.resolver';

@Module({
  imports: [],
  providers: [FilesService, FilesResolver],
  exports: [FilesService],
})
export class FilesModule {}
