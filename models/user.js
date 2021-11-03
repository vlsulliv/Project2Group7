const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');
//Extending Model to represent user in the database
//Using 
class User extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        lens: [8],
      },
    },
  },
  //activity 13-17
  //In controllers/api/userRoutes.js sequelize allows us to connect to these hooks whenever we 
  {
    hooks: {
      beforeCreate: async (newUserData) => {
        newUserData.email = await newUserData.email.toAllLowerCase();
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },

      beforeUpdate: async (updatedUserData) => {
        updatedUserData.email = await newUserData.email.toAllLowerCase();
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "user",
  }
);

module.exports = User;
