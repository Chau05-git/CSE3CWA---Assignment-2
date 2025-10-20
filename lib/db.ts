import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import path from 'path';

declare global {
  // eslint-disable-next-line no-var
  var _sequelize: Sequelize | undefined;
  // eslint-disable-next-line no-var
  var _itemModel: typeof Item | undefined;
  // eslint-disable-next-line no-var
  var _codeOutputModel: typeof CodeOutput | undefined;
}

function getSequelize(): Sequelize {
  if (!global._sequelize) {
    const storagePath = path.join(process.cwd(), 'database.sqlite');
    global._sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: storagePath,
      logging: false,
    });
  }
  return global._sequelize;
}

export class Item extends Model<InferAttributes<Item>, InferCreationAttributes<Item>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export class CodeOutput extends Model<InferAttributes<CodeOutput>, InferCreationAttributes<CodeOutput>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare content: string;
  declare language: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

function initItemModel() {
  if (!global._itemModel) {
    const sequelize = getSequelize();
    Item.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      },
      { sequelize, modelName: 'Item', tableName: 'Items' }
    );
    global._itemModel = Item;
  }
  return global._itemModel;
}

function initCodeOutputModel() {
  if (!global._codeOutputModel) {
    const sequelize = getSequelize();
    CodeOutput.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        title: { type: DataTypes.STRING, allowNull: false },
        content: { type: DataTypes.TEXT, allowNull: false },
        language: { type: DataTypes.STRING, allowNull: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      },
      { sequelize, modelName: 'CodeOutput', tableName: 'CodeOutputs' }
    );
    global._codeOutputModel = CodeOutput;
  }
  return global._codeOutputModel;
}

export async function ensureDb() {
  const sequelize = getSequelize();
  initItemModel();
  initCodeOutputModel();
  await sequelize.authenticate();
  await sequelize.sync();
}

export { Item as ItemModel, initItemModel as getItemModel, CodeOutput as CodeOutputModel, initCodeOutputModel as getCodeOutputModel };
