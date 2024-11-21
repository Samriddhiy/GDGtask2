import mongoose, {Schema } from "mongoose";

const likeSchema = new mongoose.Schema (
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post"
        }
},
{
    timestamps: true
}
)

export const Like = mongoose.model("Like", likeSchema)