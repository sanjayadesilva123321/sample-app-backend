import {Table, Column, Model, DataType, HasMany} from "sequelize-typescript";
import {User} from "./user";

@Table({
    tableName: "role",
    timestamps: true,
})
export class Role extends Model<Role> {
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
    public role: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    public status: number;

    @HasMany(() => User)
    users: User[];
}
