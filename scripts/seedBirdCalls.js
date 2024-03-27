const mongoose = require('mongoose');
const BirdCall = require('../models/birdCall'); // Update the path to where your BirdCall model is located

// MongoDB connection string
const dbUrl = 'mongodb://localhost:27017/myDB'; // Update with your database name

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully."))
    .catch(err => console.error("MongoDB connection error:", err));

const birdCalls = [{
    name: 'RICHFIELDM1_20230705_202700_174_177.wav',
    class: 'Barn Swallow',
    description: '',
    level: 1
},
{
    name: 'RICHFIELDM1_20230708_181500_165_168.wav',
    class: 'Carrion Crow',
    description: '',
    level: 1
},
{
    name: 'TEEVURCHER_20220618_074000_81_84.wav',
    class: 'Common Chaffinch',
    description: '',
    level: 1
},
{
    name: 'RICHFIELDM1_20230724_145000_186_189.wav',
    class: 'Common Wood-Pigeon',
    description: '',
    level: 1
},
{
    name: 'RICHFIELDM1_20230716_075400_174_177.wav',
    class: 'Dunnock',
    description: '',
    level: 2
},
{
    name: 'RAHORA_20230330_165400_60_63.wav',
    class: 'Eurasian Blackbird',
    description: '',
    level: 1
},
{
    name: 'RICHFIELDM1_20230718_181200_54_57.wav',
    class: 'Eurasian Blue Tit',
    description: '',
    level: 1
},
{
    name: 'RICHFIELDM1_20230710_201700_240_243.wav',
    class: 'Eurasian Linnet',
    description: '',
    level: 1
},
{
    name: 'TEEVURCHER_20220615_105500_102_105.wav',
    class: 'Eurasian Magpie',
    description: '',
    level: 1
},
{
    name: 'TEEVURCHER_20220621_114100_45_48.wav',
    class: 'Eurasian Skylark',
    description: '',
    level: 1
},
{
    name: 'TEEVURCHER_20220622_072600_240_243.wav',
    class: 'Eurasian Wren',
    description: '',
    level: 1
},
{
    name: 'CARNSOREMET_20220707_080200_93_96.wav',
    class: 'European Goldfinch',
    description: '',
    level: 2
},
{
    name: 'TEEVURCHER_20220610_182700_156_159.wav',
    class: 'European Greenfinch',
    description: '',
    level: 1
},
{
    name: 'RAHORA_20230404_071200_111_114.wav',
    class: 'European Robin',
    description: '',
    level: 1
},
{
    name: 'CARNSOREMET_20220822_185100_36_39.wav',
    class: 'European Starling',
    description: '',
    level: 1
},
{
    name: 'TEEVURCHER_20220615_092500_240_243.wav',
    class: 'European Stonechat',
    description: '',
    level: 1
},
{
    name: 'RICHFIELDM1_20230706_052800_237_240.wav',
    class: 'Goldcrest',
    description: '',
    level: 1
},
{
    name: 'RICHFIELDM1_20230711_061800_261_264.wav',
    class: 'Great Tit',
    description: '',
    level: 1
},
{
    name: 'RAHORA_20230415_184700_186_189.wav',
    class: 'Hooded Crow',
    description: '',
    level: 1
},
{
    name: 'TEEVURCHER_20220622_072600_261_264.wav',
    class: 'Meadow Pipit',
    description: '',
    level: 1
},
{
    name: 'RAHORA_20230131_125700_81_84.wav',
    class: 'Redwing',
    description: '',
    level: 3
},
{
    name: 'RICHFIELDM1_20230724_135000_198_201.wav',
    class: 'Rook',
    description: '',
    level: 1
},
{
    name: 'CARNSOREMET_20220711_045900_255_258.wav',
    class: 'Sedge Warbler',
    description: '',
    level: 1
},
{
    name: 'RICHFIELDM1_20230723_081800_174_177.wav',
    class: 'Spotted Flycatcher',
    description: '',
    level: 1
},
{
    name: 'CARNSOREMET_20220710_205900_267_270.wav',
    class: 'White Wagtail',
    description: '',
    level: 3
},
{
    name: 'RICHFIELDM1_20230721_110100_75_78.wav',
    class: 'Willow Warbler',
    description: '',
    level: 1
},
{
    name: 'RAHORA_20230324_190800_39_42.wav',
    class: 'Yellowhammer',
    description: '',
    level: 1
}];

// Function to insert bird calls into the database
const seedDB = async () => {
    await BirdCall.deleteMany({}); // Optional: Clear the BirdCall collection before inserting
    await BirdCall.insertMany(birdCalls);
    console.log("Bird calls have been added to the database.");
};

seedDB().then(() => {
    mongoose.connection.close();
});