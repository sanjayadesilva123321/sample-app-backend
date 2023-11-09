import {Table, Column, Model, DataType, Sequelize, ForeignKey, HasMany} from "sequelize-typescript";
import {Role} from "../models/role";
import {Post} from "../models/post";

@Table({
    tableName: "user",
    timestamps: true,
})
export class User extends Model<User> {
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
    })
    public id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    public email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    public password: string;

    @ForeignKey(() => Role)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 3,
    })
    public role_id: number;

    // Define the association
    @HasMany(() => Post)
    posts: Post[];
}
