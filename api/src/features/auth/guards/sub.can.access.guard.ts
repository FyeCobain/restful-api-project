import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { UsersService } from '@features/users/users.service'

// Guard to check if the request's token sub (user id) exists in the database
// And if it's refresh token is not null (not logged out)
@Injectable()
export class SubCanAccessGuard implements CanActivate {
  constructor(private userService: UsersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    return new Promise<boolean>((resolve) => {
      ;(async () => {
        const user = await this.userService.findOne(request.user['sub'])
        if (!user || user.refreshToken === null) resolve(false)
        else resolve(true)
      })()
    })
  }
}
