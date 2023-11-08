import {Table, Column, Model, DataType, Sequelize, BelongsTo, ForeignKey} from "sequelize-typescript";
import {Role} from "../models/role";
import {User} from "../models/user";

@Table({
    tableName: "user_role",
    timestamps: true,
})
export class UserRole extends Model<UserRole> {
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
    })
    public id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    public user_id: number;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => Role)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    public role_id: number;

    @BelongsTo(() => Role)
    role: Role;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
        allowNull: false,
    })
    public permission_id: number;
}
