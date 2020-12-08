const data = require("../models/ytData");
const playlistSummary = require("youtube-playlist-summary");
const xlsx = require('xlsx')
require("dotenv").config();

const config = {
  GOOGLE_API_KEY: process.env.YOUTUBE_API, // require
  PLAYLIST_ITEM_KEY: [
    "publishedAt",
    "title",
    "description",
    "videoId",
    "videoUrl",
  ], // option
};

exports.addData = (req, res, next) => {
  const ps = new playlistSummary(config);
  const { playlistID } = req.body;

  ps.getPlaylistItems(playlistID)
    .then((result) => {
      console.log(result);
      let itemsArray = [];

      result.items.forEach((item) => {
        let obj = {
          publishedAt: item.publishedAt,
          title: item.title,
          description: item.description,
          videoUrl: item.videoUrl,
          videoId: item.videoId,
        };
        itemsArray.push(obj);
      });

      const newData = new data({
        channelName: result.channelTitle,
        title: result.playlistTitle,
        noOfVideos: result.total,
        playlistUrl: result.playlistUrl,
        Items:itemsArray
      });

      newData
        .save()
        .then((result) => {
          res.json({
            message: "PlayList Saved",
            result: {
              channelName: result.channelName,
              noOfVideos: result.noOfVideos,
            },
          });
        })
        .catch((err) => {
          res.json({ message: "Something Went Wrong" });
        });
    })
    .catch(err => {
        res.json({ message: "Something Went Wrong" });
    });
};

exports.getData = (req,res,next) =>{
    data.find().then(result =>{
        res.json(result);
    }).catch(err => {
        res.json({message:"Some Error Occured"})
    })
}


exports.bulkcsv = (req,res,next) =>{
    
    console.log(req.file);
    // var wb = xlsx.readFile(filename);
    res.json(req.file)
    // console.log(wb.SheetNames)

}