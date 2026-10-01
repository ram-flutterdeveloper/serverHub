import repository from "../repositories/device-token.repository";

interface RegisterTokenDto {
  userId: string;
  token: string;
  platform: "ANDROID" | "IOS" | "WEB";
  deviceId: string;
}

class DeviceTokenService {

  async register(data: RegisterTokenDto) {

    const existing =
      await repository.findByUserAndDevice(
        data.userId,
        data.deviceId
      );

    if (existing) {

      return repository.update(existing.id, {
        token: data.token,
        platform: data.platform,
        isActive: true,
      });

    }

    return repository.create(data);
  }

  async getUserTokens(userId: string) {
    return repository.getUserTokens(userId);
  }
}

export default new DeviceTokenService();