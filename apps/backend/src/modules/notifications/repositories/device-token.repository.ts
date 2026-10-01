import { DeviceToken } from "../models";

class DeviceTokenRepository {

  async findByUserAndDevice(
    userId: string,
    deviceId: string
  ) {
    return DeviceToken.findOne({
      where: {
        userId,
        deviceId,
      },
    });
  }

  async create(data: Partial<DeviceToken>) {
    return DeviceToken.create(data as any);
  }

  async update(
    id: string,
    data: Partial<DeviceToken>
  ) {
    await DeviceToken.update(data, {
      where: {
        id,
      },
    });

    return DeviceToken.findByPk(id);
  }

  async getUserTokens(userId: string) {
    return DeviceToken.findAll({
      where: {
        userId,
        isActive: true,
      },
    });
  }

  async removeToken(id: string) {
    return DeviceToken.destroy({
      where: {
        id,
      },
    });
  }
  
  async deactivateToken(id: string) {

    return DeviceToken.update(
        {
            isActive: false,
        },
        {
            where:{
                id,
            },
        }
    );

}
}

export default new DeviceTokenRepository();