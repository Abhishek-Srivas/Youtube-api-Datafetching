const router = require('express').Router();
const controller = require('../controllers/controller')
router.post('/addData',controller.addData)
router.get('/getData',controller.getData)

module.exports = router;