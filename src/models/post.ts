import {Table, Column, Model, DataType, Sequelize} from "sequelize-typescript";

@Table({
    tableName: "post",
    timestamps: true,
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
        type: DataType.TEXT,
        allowNull: false,
    })
    public post: string;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    public created_by: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    public updated_by: number;

}