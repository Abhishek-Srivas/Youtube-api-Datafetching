const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  channelName: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  noOfVideos: {
    type: Number,
    require: true,
  },
  playlistUrl: {
    type: String,
    require: true,
  },
  language: {
    type: String,
    require: true,
  },
  Instructor: {
    type: String,
    require: true,
  },
  Quality: {
    type: String,
    require: true,
  },
  Category: {
    type: String,
    require: true,
  },
  SubCategory: {
    type: String,
    require: true,
  },
  Subject: {
    type: String,
    require: true,
  },

  Items: [
    {
      publishedAt: {
        type: String,
        require: true,
      },
      title: {
        type: String,
        require: true,
      },
      description: {
        type: String,
        require: true,
      },
      videoUrl: {
        type: String,
        require: true,
      },
      videoId: {
        type: String,
        require: true,
      },
    },
  ],
});

module.exports = mongoose.model("ytDataExcel", dataSchema);
