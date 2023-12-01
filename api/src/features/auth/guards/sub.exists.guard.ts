import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { UsersService } from '@features/users/users.service'

// Guard to check if the request's token sub (user id) exists in the database
@Injectable()
export class SubExistsGuard implements CanActivate {
  constructor(private userService: UsersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    return new Promise<boolean>((resolve) => {
      ;(async () => {
        if (!(await this.userService.findOne(request.user['sub'])))
          resolve(false)
        else resolve(true)
      })()
    })
  }
}
