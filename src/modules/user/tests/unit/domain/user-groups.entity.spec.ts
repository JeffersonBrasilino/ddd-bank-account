import {
  UserGroupsEntity,
  UserGroupsEntitytProps,
} from '@module/user/domain/user-groups.entity';
describe('UserGroupsEntity', () => {
  let sut: UserGroupsEntity;
  beforeAll(() => {
    const props: UserGroupsEntitytProps = {
      id: 1,
      main: true,
      name: 'dummy',
      permissions: {},
      userGroupUserId: 1,
    };
    sut = UserGroupsEntity.create(props) as UserGroupsEntity;
  });

  it('should be created successfully', () => {
    expect(sut).toBeInstanceOf(UserGroupsEntity);
  });

  /*   it('should be create error with invalid data', () => {
    const sut = UserGroupsEntity.create({}) as any;
    expect(sut).toBeInstanceOf(ValidationError);
    expect((sut as AbstractError<any>).getError()).toMatchObject({
      name: ['is required'],
    });
  }); */

  const getMethodsToTest = [
    { method: 'getId', toReturn: 1 },
    { method: 'getName', toReturn: 'dummy' },
    { method: 'getPermissions', toReturnInstance: Object },
    { method: 'isMain', toReturn: true },
    { method: 'getUserGroupUserId', toReturn: 1 },
  ];
  for (const target of getMethodsToTest) {
    it(`should be ${target.method} method is defined`, () => {
      expect(typeof sut[target.method] == 'function').toEqual(true);
      if (target.toReturn !== undefined)
        expect(sut[target.method]()).toBe(target.toReturn);
      else expect(sut[target.method]()).toBeInstanceOf(target.toReturnInstance);
    });
  }
});
