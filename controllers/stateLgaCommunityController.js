const State = require('../models/stateModel');
const LGA = require('../models/lgaModel');
const Community = require('../models/communityModel')


const createState = async (req, res) => {
    try {
        const { stateName, stateCapital, slogan, governorName, zonalRegion, landMark, yearCreated } = req.body;

        if(!stateName || !stateCapital || !slogan || !governorName || !zonalRegion || !landMark || !yearCreated){
            return res.status(400).json({
                message: "please fill every details"
            })
        }
        const existingState = await State.findOne({ stateName });
        if (existingState) {
            return res.status(401).json({ message: 'State already exists' });
        }   
        const state = new State({
            stateName,
            stateCapital,
            slogan,
            governorName,
            zonalRegion,
            landMark,
            yearCreated
        });
        await state.save();

        res.status(201).json({ 
            message: 'State created successfully',
            state
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStates =  async(req, res)=>{
    try{
        const states = await State.find();
        if(!states){
            return res.status(404).json({
                message: "no state found"
            })
        }

        res.status(201).json({
            message: "List of States",
            states
        })

    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}


const createLga = async(req, res)=>{
    try{
        const {stateId, lgaName, lgaChairman} = req.body;
        if(!stateId || !lgaName || !lgaChairman){
            return res.status(400).json({
                message: "please input all field"
            })
        }

        const lga = await LGA.findOne({lgaName});
        if(lga){
            return res.status(403).json({
                message: "LGA already exist"
            })
        }

        const state = await State.findById(stateId);
        if(!state){
            return res.status(404).json({
                message: "no state found"
            })
        }

        const newLga = new LGA({
            state: stateId,
            lgaName,
            lgaChairman
        });
        state.lga.push(newLga._id);
        await state.save();

        await newLga.save();

        res.status(201).json({
            message: "State Name and LGA",
            newLga
        })

    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
};

const getLgas = async(req, res)=>{
    try{
        const lgas = await LGA.find().populate("state", "stateName-_id");
        if(!lgas){
            return res.status(404).json({
                message: "no lga found"
            })
        }

        res.status(201).json({
            message: "List of LGA",
            lgas
        })

    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
};

const createCommunity = async(req, res)=>{
    try{
        const {lgaId, communityName} = req.body;

        const community = await Community.findOne({communityName});
        if(community){
            return res.status(403).json({
                message: "Community already exist"
            });
        }
        const lga = await LGA.findById(lgaId);
        if(!lga){
            return res.status(404).json({
                message: "LGA not found"
            });
        }

        const newCommunity = new Community({
            lga: lgaId,
            communityName
        });
        lga.community.push(newCommunity._id);
        await lga.save();

        await newCommunity.save();

        res.status(201).json({
            message: "Community created successfully",
            newCommunity
        })

    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
};

const getCommunitiesInLga = async (req, res)=>{
    try{
        const community = await Community.find()
        .populate("lga", "lgaName-_id");

         if(!community){
            return res.status(404).json({
                message: "no Community found"
            })
        }

        res.status(201).json({
            message: "List of Communities",
            community
        })


    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
};

const getLgasByStateId = async(req, res)=>{
    try{
        const {stateId} = req.params;
        const lgas = await LGA.find({state: stateId}).populate("state", "stateName-_id");
        if(!lgas.length){
            return res.status(404).json({
                message: "no lga found for this state"
            })
        }

        res.status(201).json({
            message: `List of LGA`,
            lgas
        })

    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
};

const getCommunityBylgaId = async(req, res)=>{
    try{
        const {lgaId} = req.params;
        const community = await Community.find({lga: lgaId}).populate("lga", "lgaName-_id");
        if(!community.length){
            return res.status(404).json({
                message: "no community found for this LGA"
            })
        }

        res.status(201).json({
            message: `List of Communities`,
            community
        })

    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
};

const searchLocation = async (req, res) => {
  const { name } = req.query;
    
   const community = await Community.findOne({
    communityName: { $regex: name, $options: "i" }
  })
    .populate({
    path: "lga",
    populate: [{ path: "community", select: "communityName-_id" },
        {path: "state", select: "stateName-_id"}
    ]
  });

  if (community) return res.json({ type: "Community", data: community });


  // Try LGA first
  const lga = await LGA.findOne({
    lgaName: { $regex: name, $options: "i" }
  })
    .populate("state", "stateName-_id")
    .populate("community", "communityName-_id");

  if (lga) return res.json({ type: "LGA", data: lga });

  // Try State
  const state = await State.findOne({
    stateName: { $regex: name, $options: "i" }
  }).populate({
    path: "lga",
    populate: [{ path: "community", select: "communityName-_id" },
        {path: "state", select: "stateName-_id"}
    ]
  });

  if (state) return res.json({ type: "STATE", data: state });

  res.status(404).json({ message: "Not found" });
};



module.exports = {
    createState,
    getStates,
    createLga,
    getLgas,
    createCommunity,
    getCommunitiesInLga,
    getLgasByStateId,
    getCommunityBylgaId,
    searchLocation
    
}

