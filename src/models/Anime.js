import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const episodeSchema = new Schema(
  {
    episode: {
      type: Number,
      required: true,
    },
    servers: [
      {
        server: {
          type: String,
          enum: ["Fembed", "MEGA", "Netu", "Okru", "Stape", "SW", "YourUpload"],
          required: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true, // Add timestamps to the episode subdocument
    _id: false, // Disable the creation of _id for each episode
  }
);

const animeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    alternative_titles: [String],
    description: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    poster: {
      type: String,
      trim: true,
    },
    last_episode: {
      type: Number,
    },
    genres: [String],
    type: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Proximamente", "Finalizado", "En emision"],
      default: "En emision",
    },
    episodes: [episodeSchema],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

animeSchema.plugin(mongoosePaginate);

export default model("Anime", animeSchema);
