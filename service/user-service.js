const { sequelize } = require('../db');
const UserModel = sequelize.models.Users;

class UserService {
  async findOrCreate(message) {
    console.log(message);
    try {
      return await sequelize.transaction(async function (transaction) {
        const [user, created] = await UserModel.findOrCreate({
          where: { user_id: message.chat.id },
          defaults: {
            username: message.chat.username || message.chat.first_name,
          },
        });
        return user;
      });
    } catch (e) {
      console.log(e);
    }
  }

  async update(user_id, lastMessage) {
    try {
      return await sequelize.transaction(async function (transaction) {
        const res = await UserModel.update(
          { lastMessage },
          {
            where: { user_id },
          }
        );
        console.log(res);
        return res;
      });
    } catch (e) {
      console.log(e);
    }
  }

  async ban(user_id) {
    try {
      return await sequelize.transaction(async function (transaction) {
        const res = await UserModel.update(
          { isBanned: true },
          {
            where: { user_id },
          }
        );
        return res;
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new UserService();
