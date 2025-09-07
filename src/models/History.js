
import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    animeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Anime',
      required: true,
    },
    status: {
      type: String,
      enum: ['watching', 'completed', 'planned'],
      default: 'watching',
    },
    episodesWatched: {
      type: [Number],
      default: [],
    },
    lastEpisode: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const History = mongoose.model('History', historySchema);

export default History;
