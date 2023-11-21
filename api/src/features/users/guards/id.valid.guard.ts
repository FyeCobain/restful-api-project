import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common'
import { isValidObjectId } from 'mongoose'
import { Observable } from 'rxjs'

// Guard to check if the given user id has a valid mongoose id format
@Injectable()
export class IdValidGuard implements CanActivate {
  //canActivate implementation
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    if (!isValidObjectId(request.params.id))
      throw new BadRequestException('Incorrect id format')
    return true
  }
}
