// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { graphqlUploadExpress } from 'graphql-upload';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.use(graphqlUploadExpress())

//   app.useGlobalPipes()

//   await app.listen(4001);
// }
// bootstrap();

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { graphqlUploadExpress } from 'graphql-upload'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Cors config
  app.enableCors()

  app.use(graphqlUploadExpress())

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const errorMessage = errors.map(error =>
          Object.values(error.constraints).join(', ')
        )

        const errorMessageParse = errorMessage
          .map(error => error.charAt(0).toUpperCase() + error.slice(1))
          .join(', ')

        return new BadRequestException(String(errorMessageParse))
      },
      forbidUnknownValues: false,
    })
  )

  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)

  const port = process.env.PORT || 4000
  await app.listen(port)

  Logger.log(`🚀 Application is running on: ${await app.getUrl()}/graphql)`)
}

bootstrap()
