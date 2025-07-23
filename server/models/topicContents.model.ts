import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../utils/database';
import Topic from './topic.model';

interface TopicContentsAttributes {
  id: number;
  topicId: string;
  title: string;
  description?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  videoSection?: string;
  videoLength?: number;
  videoPlayer?: string;
  links?: string;
  suggestion?: string;
  questions?: string;
  position: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TopicContentsCreationAttributes extends Optional<TopicContentsAttributes, 'id'> {}

class TopicContents
  extends Model<TopicContentsAttributes, TopicContentsCreationAttributes>
  implements TopicContentsAttributes
{
  public id!: number;
  public topicId!: string;
  public title!: string;
  public description?: string;
  public videoUrl?: string;
  public videoThumbnail?: string;
  public videoSection?: string;
  public videoLength?: number;
  public videoPlayer?: string;
  public links?: string;
  public suggestion?: string;
  public questions?: string;
  public position!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TopicContents.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    topicId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: Topic,
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    videoUrl: {
      type: DataTypes.STRING,
    },
    videoThumbnail: {
      type: DataTypes.STRING,
    },
    videoSection: {
      type: DataTypes.STRING,
    },
    videoLength: {
      type: DataTypes.INTEGER,
    },
    videoPlayer: {
      type: DataTypes.STRING,
      defaultValue: 'youtube',
    },
    links: {
      type: DataTypes.TEXT,
    },
    suggestion: {
      type: DataTypes.TEXT,
    },
    questions: {
      type: DataTypes.TEXT,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'TopicContents',
  }
);

export default TopicContents;
