import { LoginUserSchema, RegisterUserSchema } from "@/lib/apis/auth/auth-schema";
import { BaseApi } from "@/lib/apis/base";

export class AuthApi extends BaseApi {
  login(email: string, password: string, deviceInfo: DeviceInfo) {
    return this.post<BaseApiResult<UserAuthorizedResult>, LoginUserSchema>({
      url: this.endpoints.auth.signin,
      data: { email, password, deviceInfo },
    });
  }

  registerUser(data: RegisterUserSchema) {
    return this.post<BaseApiResult<UserAuthorizedResult>, RegisterUserSchema>({
      url: this.endpoints.auth.signup,
      data,
    });
  }
}
