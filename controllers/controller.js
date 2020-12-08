const data = require("../models/ytData");
const excelDataSchema = require("../models/excelData");
const playlistSummary = require("youtube-playlist-summary");
const xlsx = require("xlsx");
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
        Items: itemsArray,
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
    .catch((err) => {
      res.json({ message: "Something Went Wrong" });
    });
};

exports.getData = (req, res, next) => {
  data
    .find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json({ message: "Some Error Occured" });
    });
};

exports.bulkcsv = (req, res, next) => {
  const filepath = req.file.path;

  var ws = xlsx.readFile(filepath); // ws:- workSheet
  var data = xlsx.utils.sheet_to_json(ws.Sheets["Sheet1"]);

  const ps = new playlistSummary(config);
 

  data.forEach(async (sheetItem) => {
      
  const result = await  ps.getPlaylistItems(sheetItem["Playlist ID"])
      
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
        
        const newData = new excelDataSchema({
          channelName: result.channelTitle,
          title: sheetItem.Title,
          noOfVideos: result.total,
          playlistUrl: sheetItem["Playlist Link"],
          Items: itemsArray,
          language: sheetItem.Language,
          Instructor: sheetItem.Instructor,
          Quality: sheetItem.Quality,
          Category: sheetItem.Category,
          SubCategory: sheetItem.Subcategory,
          Subject: sheetItem.Subject,
        });

        const savedData = await newData.save(); 
        
  });

   res.json({message:"Sheet Data Saved "})
};

exports.getExcelData = (req, res, next) => {
  excelDataSchema
    .find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json({ message: "Some Error Occured" });
    });
};
