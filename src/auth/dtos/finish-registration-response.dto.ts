import { AuthPackage } from '../entities/auth-package.entity.js';

export class FinishRegistrationResponseDto {
  success: boolean;
  message: string;
  authPackage: AuthPackage;
}
