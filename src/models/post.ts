import {Table, Column, Model, DataType, ForeignKey} from "sequelize-typescript";
import {User} from "../models/user";

@Table({
    tableName: "post",
    timestamps: false,
})
export class Post extends Model<Post> {
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
    public title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    public content: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.NUMBER,
        allowNull: true,
    })
    public created_by: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true,
    })
    public updated_by: number;
}
