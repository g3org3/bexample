const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',
  // SQLite only
  storage: 'data/database.sqlite',
  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false,
});

const ModifierSchema = {
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
};

const Modifier = sequelize.define('modifier', ModifierSchema, {
  timestamps: true,
});

Modifier.sync({ alter: true });

exports.Modifier = Modifier;
