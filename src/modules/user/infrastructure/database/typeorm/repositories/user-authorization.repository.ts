import { UserAuthorizationDataProviderInterface } from '@core/infrastructure/http/nestjs/guards/user/authorization';
import { UsersGroupsPermissionsEntity } from '../entities/users-groups-permissions.entity';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { AbstractError, ErrorFactory } from '@core/domain/errors';

export class UserAuthirizationRepository
  implements UserAuthorizationDataProviderInterface
{
  async checkPermissionRouteByUser(
    userUuid: string,
    route: string,
    action: string,
    publicKey: string,
  ): Promise<boolean | AbstractError<any>> {
    try {
      const result = await UsersGroupsPermissionsEntity.createQueryBuilder(
        'ugp',
      )
        .innerJoin(
          (qb: SelectQueryBuilder<any>) => {
            return qb
              .select([
                'ara.id as ara_id',
                'ara.status as ara_status',
                'ara.api_route_id',
              ])
              .from('auth.api_routes_applications', 'ara')
              .innerJoin(
                (araSubQuery: SelectQueryBuilder<any>) => {
                  return araSubQuery
                    .select(['ar.id as route_id', 'ar.status as route_status'])
                    .from('auth.api_routes', 'ar')
                    .where(`ar.status = '1'`)
                    .andWhere(`ar.route = :route`, { route });
                },
                'ar',
                '"ar"."route_id" = ara.api_route_id',
              )
              .innerJoin(
                (appSubQuery: SelectQueryBuilder<any>) => {
                  return appSubQuery
                    .select('app.id as app_id')
                    .from('auth.applications', 'app')
                    .where(`app.status = '1'`)
                    .andWhere('public_key = :publicKey', { publicKey });
                },
                'app',
                '"app"."app_id" = ara.application_id',
              )
              .where(`ara.status = '1'`);
          },
          'ara',
          '"ara"."ara_id" = ugp.apiRouteApplicationId',
        )
        .innerJoin('ugp.usersGroups', 'usersGroups', `usersGroups.status ='1'`)
        .innerJoin(
          'usersGroups.users',
          'usersGroupsUser',
          `usersGroupsUser.status = '1'`,
        )
        .innerJoin('usersGroupsUser.user', 'users', `users.status = '1'`)
        .where(`ugp.status = '1'`)
        .andWhere('users.uuid = :userUuid', {
          userUuid,
        })
        .andWhere('upper(ugp.action) = upper(:action)', { action })
        .getCount();
      return result > 0;
    } catch (err) {
      return ErrorFactory.create('Internal', 'error while checking permission');
    }
  }
}
