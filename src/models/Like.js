import mongoose from 'mongoose';


const likeSchema = new mongoose.Schema(
{
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
type: { type: String, enum: ['like', 'dislike'], default: 'like' },
},
{ timestamps: true }
);


likeSchema.index({ user: 1, video: 1 }, { unique: true, partialFilterExpression: { video: { $type: 'objectId' } } });
likeSchema.index({ user: 1, comment: 1 }, { unique: true, partialFilterExpression: { comment: { $type: 'objectId' } } });


export default mongoose.model('Like', likeSchema);