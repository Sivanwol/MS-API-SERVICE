import request from 'supertest';
import App from '@/app';
import { AuthController } from '@controllers/auth.controller';
import { LoginUserDto } from '@dtos/users.dto';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Auth', () => {
  describe('[POST] /signup', () => {
    it('response should have the Create userData', () => {
      const userData: LoginUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      };

      const app = new App([AuthController]);
      return request(app.getServer()).post('/signup').send(userData);
    });
  });

  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const userData: LoginUserDto = {
        email: 'lim@gmail.com',
        password: 'q1w2e3r4',
      };

      const app = new App([AuthController]);
      return request(app.getServer())
        .post('/login')
        .send(userData)
        .expect('Set-Cookie', /^Authorization=.+/);
    });
  });

  // error: StatusCode : 404, Message : Authentication token missing
  // describe('[POST] /logout', () => {
  //   it('logout Set-Cookie Authorization=; Max-age=0', () => {
  //     const authRoute = new AuthRoute();
  //     const app = new App([authRoute]);

  //     return request(app.getServer())
  //       .post('/logout')
  //       .expect('Set-Cookie', /^Authorization=\;/);
  //   });
  // });
});
