import { SetMetadata } from '@nestjs/common';

export const ALLOWED_GROUPS_KEY = 'allowed_groups';

export const ADMIN_GROUP = 'admin';
export const PLATFORM_ADMIN_GROUP = 'platform-admin';
export const FULL_ACCESS_GROUPS: string[] = [ADMIN_GROUP, PLATFORM_ADMIN_GROUP];

export const AllowedGroups = (...groups: string[]) =>
  SetMetadata(ALLOWED_GROUPS_KEY, groups);
