import {Table, Column, Model, DataType, Sequelize} from "sequelize-typescript";

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

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    public user_id: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    public role_id: number;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
        allowNull: false,
    })
    public permission_id: number;

}