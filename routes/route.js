const router = require('express').Router();
const controller = require('../controllers/controller')
const multer = require('multer');

const fileStorage = multer.diskStorage({ //for multer storage
    //these are two functions which are called by multer for incoming file
    destination: (req, file, cb)=> {
        cb(null,'uploads'); // null tells the call backs that its ok to store the file because that place is for error
    },
    filename:(req, file, cb)=> {
        cb(null,new Date().toDateString() + "-" + file.originalname);
    }
});

const Filter = (req, file, cb) => { //For filtering the type of file
    if(file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ){
        cb(null,true);  //if we want to store that file
    }
    else{
        cb(null,false); //if we dont want to store that file
        console.log("wrong file type");
    }
};

const fileMulter = multer({storage:fileStorage,fileFilter:Filter}).single('dataFile');

router.post('/addData',controller.addData)
router.get('/getData',controller.getData)
router.post('/excelUpload',fileMulter,controller.bulkcsv)

module.exports = router;