import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let spyService: UserService;

  beforeEach(async () => {
    const UserServiceProvider = {
      provide: UserService,
      useFactory: () => ({
        create: jest.fn((data) => {
          if (!data) {
            return {
              status: 400,
              message: 'User information is required',
              data: {},
            };
          }
          return {
            status: 201,
            message: 'User created successfully!',
            data,
          };
        }),
        findAll: jest.fn(() => {
          return {
            status: 200,
            message: 'Users retrieved successfully!',
            data: [],
          };
        }),
        findOne: jest.fn((id) => {
          if (!id) {
            return {
              status: 400,
              message: 'User id is required',
              data: {},
            };
          }
          return {
            status: 200,
            message: 'User retrieved successfully!',
            data: {},
          };
        }),
        update: jest.fn((id, data) => {
          if (!id) {
            return {
              status: 400,
              message: 'User id is required',
              data: {},
            };
          }
          if (!data) {
            return {
              status: 400,
              message: 'User information is required',
              data: {},
            };
          }
          return {
            status: 200,
            message: 'User updated successfully!',
            data,
          };
        }),
        remove: jest.fn((id) => {
          if (!id) {
            return {
              status: 400,
              message: 'User id is required',
              data: {},
            };
          }
          return {
            status: 200,
            message: 'User deleted successfully!',
          };
        }),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserServiceProvider],
    }).compile();

    controller = module.get<UserController>(UserController);
    spyService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('User Controller', () => {
    const user: CreateUserDTO = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date(),
      email: 'johndoe@example.com',
      phoneNumber: '+1 (555) 555-5555',
      address: '123 Main St',
      dateHired: new Date(),
      salary: 100000,
      password: 'password',
    };

    describe('User creation', () => {
      it('should create an user', async () => {
        const response = await controller.create(user);
        expect(response.data).toBe(user);
        expect(spyService.create).toHaveBeenCalledWith(user);
      });
      it('should throw error when no payload is supplied', async () => {
        const response = await controller.create(null);
        expect(response.status).toBe(400);
        expect(response.message).toBe('User information is required');
      });
    });

    describe('User retrieval', () => {
      it('should retrieve all users', async () => {
        const response = await controller.findAll();
        expect(response.data).toEqual([]);
        expect(spyService.findAll).toHaveBeenCalled();
      });
      it('should retrieve an user', async () => {
        const response = await controller.findOne('1');
        expect(response.data).toEqual({});
        expect(spyService.findOne).toHaveBeenCalledWith(1);
      });
      it('should throw error when no id is supplied', async () => {
        const response = await controller.findOne(null);
        expect(response.status).toBe(400);
        expect(response.message).toBe('User id is required');
      });
    });

    describe('User update', () => {
      it('should update an user', async () => {
        const response = await controller.update('1', user, {});
        expect(response.data).toEqual(user);
        expect(spyService.update).toHaveBeenCalledWith(1, user);
      });
      it('should throw error when no id is supplied', async () => {
        const response = await controller.update(null, user, {});
        expect(response.status).toBe(400);
        expect(response.message).toBe('User id is required');
      });
      it('should throw error when no payload is supplied', async () => {
        const response = await controller.update('1', null, {});
        expect(response.status).toBe(400);
        expect(response.message).toBe('User information is required');
      });
    });

    describe('User deletion', () => {
      it('should delete an user', async () => {
        const response = await controller.remove('1');
        expect(response.status).toBe(200);
        expect(spyService.remove).toHaveBeenCalledWith(1);
      });
      it('should throw error when no id is supplied', async () => {
        const response = await controller.remove(null);
        expect(response.status).toBe(400);
        expect(response.message).toBe('User id is required');
      });
    });
  });
});
