// Core imports
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'

// User service import
import { UsersService } from '@features/users/users.service'

// Guard to check if the token's sub (user id) exists in the database
@Injectable()
export class SubExistsGuard implements CanActivate {
  // Constructor
  constructor(private userService: UsersService) {}

  // canActivate implementation
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
