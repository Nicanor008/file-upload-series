import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { FilesService } from './files.service';

@Resolver()
export class FilesResolver {

    constructor(private readonly filesService: FilesService) {}

    @Query(() => String) 
    async Test() {
        return 'here we go'
    }

    @Mutation(() => Boolean)
    async AWSfileUpload(@Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload) {
        return this.filesService.AWSfileUpload(file)
    }

    @Mutation(() => Boolean)
    async CloudinaryfileUpload(@Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload) {
        return this.filesService.CloudinaryfileUpload(file)
    }

    @Mutation(() => Boolean)
    async LocalfileUpload(@Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload) {
        console.log('..........Here we go............')
        return this.filesService.LocalfileUpload(file)
    }
}
