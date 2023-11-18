// Libraries imports
import { MongoError } from 'mongodb'
import { MongooseError } from 'mongoose'
import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  UnprocessableEntityException,
} from '@nestjs/common'
// Local imports
import { capitalize } from '@helpers/strings'

// Exception filter for mongo & mongoose exceptions
@Catch(MongoError, MongooseError)
export class MongoExceptionFilter implements ExceptionFilter {
  // Overriding the 'catch' method
  catch(catchedException: any, host: ArgumentsHost) {
    // The request variable that will be instantiated to an exception
    let exceptionToReturn: UnprocessableEntityException | ConflictException
    // The response for returning the new staus
    const response = host.switchToHttp().getResponse()
    //Verifying type of exception
    switch (catchedException.code) {
      case 11000: // Unique property already in use = Conflict [409]...
        // Returning the 409 status...
        exceptionToReturn = new ConflictException()
        return response.status(exceptionToReturn.getStatus()).json({
          statusCode: exceptionToReturn.getStatus(),
          error: exceptionToReturn.message,
          message: [
            `The ${
              Object.keys(catchedException.keyPattern)[0]
            } is already in use`,
          ],
        })

      default: // Validation error = Unprocessable Entity [422]...
        exceptionToReturn = new UnprocessableEntityException()
        // Copying the exception cached in a variable of type any, to avoid TS complaints...
        const exception: any = catchedException
        // If the exception comes from Mongoose...
        if (catchedException instanceof MongooseError) {
          return response.status(exceptionToReturn.getStatus()).json({
            message: [this.getMongooseValidationErrorMessage(catchedException)],
            error: exceptionToReturn.message,
            statusCode: exceptionToReturn.getStatus(),
          })
        }
        // Returning a generic Unprocessable Entity exception...
        else {
          return response.status(exceptionToReturn.getStatus()).json({
            message: exception.errors.name,
            statusCode: exceptionToReturn.getStatus(),
          })
        }
    }
  }

  // Method for getting the appropiate MongooseError message
  getMongooseValidationErrorMessage(exception: any): string {
    switch (exception.errors.name.kind) {
      case 'required':
        return `${capitalize(exception.errors.name.path)} must not be empty`
      default:
        return `The ${exception.errors.name.path} is ${exception.errors.name.kind}`
    }
  }
}
