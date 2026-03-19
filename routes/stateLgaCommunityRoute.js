const express = require('express');
const router = express.Router();

const {auth} = require('../middlewares/authMiddleware')

const {createState, getStates, createLga, getLgas, createCommunity,
    getCommunitiesInLga, getLgasByStateId, getCommunityBylgaId, searchLocation} = require('../controllers/stateLgaCommunityController');

router.post('/create-state', auth, createState);
router.get('/states', getStates)
router.post('/create-lga', auth, createLga);
router.get('/lga', getLgas);
router.get('/lga/:stateId', getLgasByStateId)
router.post('/create-community', auth, createCommunity);
router.get('/community', getCommunitiesInLga)
router.get('/community/:lgaId', getCommunityBylgaId);
router.get('/search', searchLocation)








module.exports = router;
