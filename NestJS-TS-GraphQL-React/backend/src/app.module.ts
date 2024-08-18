// import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { GraphQLModule } from '@nestjs/graphql';
// import { FilesModule } from './files/files.module';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// import {
//   ApolloServerPluginLandingPageLocalDefault,
//   ApolloServerPluginLandingPageProductionDefault,
// } from '@apollo/server/plugin/landingPage/default'
// import { ConfigModule } from '@nestjs/config';
// import { graphqlUploadExpress } from 'graphql-upload';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),
//     GraphQLModule.forRootAsync<ApolloDriverConfig>({
//       driver: ApolloDriver,
//       useFactory: async () => ({
//         autoSchemaFile: true,
//         playground: false,
//         uploads: false,
//         // plugins: [ApolloServerPluginLandingPageLocalDefault({ footer: false })],
//         plugins: [
//           process.env.NODE_ENV === 'production'
//             ? ApolloServerPluginLandingPageProductionDefault({
//                 graphRef: 'files@app',
//                 footer: false,
//               })
//             : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
//         ],
//       }),
//     }),
//     FilesModule
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// // export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }))
//       .forRoutes('graphql')
//   }
// }

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'
import { GraphQLError, GraphQLFormattedError } from 'graphql'
import { graphqlUploadExpress } from 'graphql-upload'
import { isArray } from 'class-validator'
import {
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageLocalDefault,
} from '@apollo/server/plugin/landingPage/default'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FilesModule } from './files/files.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => ({
        playground: false,
        uploads: false,
        plugins: [
          process.env.NODE_ENV === 'production'
            ? ApolloServerPluginLandingPageProductionDefault({
                graphRef: 'nature-connect@app',
                footer: false,
              })
            : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
        ],
        autoSchemaFile: true,
        formatError: (error: GraphQLError) => {
          const formattedError: GraphQLFormattedError = {
            message: isArray(error.extensions?.response?.['message'])
              ? error.extensions?.response?.['message'][0]
              : error.extensions?.response?.['message'] ||
                error.extensions?.response ||
                error.message ||
                error.extensions?.response?.['message'] ||
                error.extensions?.exception?.['response']?.message ||
                error.extensions?.exception?.['message']?.message ||
                error.extensions?.exception?.['response'] ||
                error.extensions?.exception?.['message'] ||
                error?.extensions ||
                error,
          }
          return formattedError
        },
      }),
      inject: [ConfigService],
    }),
    FilesModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }))
      .forRoutes('graphql')
  }
}
