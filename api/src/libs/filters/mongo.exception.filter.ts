// Libraries imports
import { MongoError } from 'mongodb'
import { MongooseError } from 'mongoose'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { capitalize } from '@helpers/strings'

// Exception filter for mongo & mongoose exceptions
@Catch(MongoError, MongooseError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(catchedException: any, host: ArgumentsHost) {
    let exceptionToReturn: UnprocessableEntityException | BadRequestException // Request variable that will be instantiated to an exception
    const response = host.switchToHttp().getResponse()
    switch (catchedException.code) {
      case 11000: // Unique property already in use = Bad Request [400]
        exceptionToReturn = new BadRequestException()
        return response.status(exceptionToReturn.getStatus()).json({
          statusCode: exceptionToReturn.getStatus(),
          error: exceptionToReturn.message,
          message: [
            `The ${
              Object.keys(catchedException.keyPattern)[0]
            } is already in use`,
          ],
        })

      default: // Validation error = Unprocessable Entity [422]
        exceptionToReturn = new UnprocessableEntityException()
        const exception: any = catchedException // To avoid TS complaints...
        if (catchedException instanceof MongooseError) {
          return response.status(exceptionToReturn.getStatus()).json({
            message: this.getMongooseValidationErrorMessages(catchedException),
            error: exceptionToReturn.message,
            statusCode: exceptionToReturn.getStatus(),
          })
        } else {
          return response.status(exceptionToReturn.getStatus()).json({
            message: exception.errors.name,
            statusCode: exceptionToReturn.getStatus(),
          })
        }
    }
  }

  // Method for getting the appropiate MongooseError messages for each invalid field
  getMongooseValidationErrorMessages(exception: any): string[] {
    return Object.keys(exception.errors).map((invalidField: string) => {
      switch (exception.errors[invalidField].kind) {
        case 'required':
          return `${capitalize(invalidField)} must not be blank`
        default:
          return exception.errors[invalidField].message
      }
    }) as string[]
  }
}
