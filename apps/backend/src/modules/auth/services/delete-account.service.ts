
import { AppError } from "../../../helpers/AppError";
import { User } from "../models";

class DeleteAccountService {

  async execute(userId: string) {

    // ==========================================
    // FIND USER
    // ==========================================

    const user = await User.findByPk(userId);

    if (!user) {
      throw new AppError(
        "User not found",
        404
      );
    }

    // ==========================================
    // DELETE ACCOUNT
    // ==========================================
    //
    // User model has paranoid: true
    //
    // Therefore this performs SOFT DELETE.
    //
    // deletedAt will be populated.
    //

    await user.destroy();

    return true;
  }
}

export default new DeleteAccountService();