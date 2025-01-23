import { AppDataSource } from 'src/config/data-source';
import { SignInDto } from 'src/modules/auth/dto/sign-in.dto';
import { User } from '../entities/user.entity';
import { EntityStatus } from 'src/common/enum/entity-status.enum';

export const UserRepository = AppDataSource.getRepository(User).extend({
  async validateUser(signInDto: SignInDto): Promise<User | null> {
    const { email, password } = signInDto;

    const user = await this.findOneBy({ email, status: EntityStatus.ACTIVE });

    if (user && (await user.validatePassword(password))) {
      return user;
    }

    return null;
  },
});
