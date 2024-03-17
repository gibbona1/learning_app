const mongoose = require('mongoose');
const BirdCall = require('../models/birdCall'); // Update the path to where your BirdCall model is located

// MongoDB connection string
const dbUrl = 'mongodb://localhost:27017/myDB'; // Update with your database name
const BASE_URL = 'https://my-audio-bucket-2024.s3.amazonaws.com/';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully."))
    .catch(err => console.error("MongoDB connection error:", err));

const birdCalls = [{
    name: 'RICHFIELDM1_20230705_202700',
    class: 'Barn Swallow',
    description: '',
    audioUrl: BASE_URL + 'RICHFIELDM1_20230705_202700.wav',
    level: 1
},
{
    name: 'RICHFIELDM1_20230708_181500',
    class: 'Carrion Crow',
    description: '',
    audioUrl: BASE_URL + 'RICHFIELDM1_20230708_181500.wav',
    level: 1
},
{
    name: 'TEEVURCHER_20220618_074000',
    class: 'Common Chaffinch',
    description: '',
    audioUrl: BASE_URL + 'TEEVURCHER_20220618_074000.wav',
    level: 1
},
{
    name: 'RICHFIELDM1_20230724_145000',
    class: 'Common Wood-Pigeon',
    description: '',
    audioUrl: BASE_URL + 'RICHFIELDM1_20230724_145000.wav',
    level: 1
},
{
    name: 'RICHFIELDM1_20230716_075400',
    class: 'Dunnock',
    description: '',
    audioUrl: BASE_URL + 'RICHFIELDM1_20230716_075400.wav',
    level: 2
},
{
    name: 'RAHORA_20230330_165400',
    class: 'Eurasian Blackbird',
    description: '',
    audioUrl: BASE_URL + 'RAHORA_20230330_165400.wav',
    level: 1
},
{
    name: 'RICHFIELDM1_20230718_181200',
    class: 'Eurasian Blue Tit',
    description: '',
    audioUrl: BASE_URL + 'RICHFIELDM1_20230718_181200.wav',
    level: 1
},
{
    name: 'RICHFIELDM1_20230710_201700',
    class: 'Eurasian Linnet',
    description: '',
    audioUrl: BASE_URL + 'RICHFIELDM1_20230710_201700.wav',
    level: 1
},
{
    name: 'TEEVURCHER_20220615_105500',
    class: 'Eurasian Magpie',
    description: '',
    audioUrl: BASE_URL + 'TEEVURCHER_20220615_105500.wav',
    level: 1
},
{
    name: 'TEEVURCHER_20220621_114100',
    class: 'Eurasian Skylark',
    description: '',
    audioUrl: BASE_URL + 'TEEVURCHER_20220621_114100.wav',
    level: 1
},
{
    name: 'TEEVURCHER_20220622_072600',
    class: 'Eurasian Wren',
    description: '',
    audioUrl: BASE_URL + 'TEEVURCHER_20220622_072600.wav',
    level: 1
},
{
    name: 'CARNSOREMET_20220707_080200',
    class: 'European Goldfinch',
    description: '',
    audioUrl: BASE_URL + 'CARNSOREMET_20220707_080200.wav',
    level: 2
},
{
    name: 'TEEVURCHER_20220610_182700',
    class: 'European Greenfinch',
    description: '',
    audioUrl: BASE_URL + 'TEEVURCHER_20220610_182700.wav',
    level: 1
},
{
    name: 'RAHORA_20230404_071200',
    class: 'European Robin',
    description: '',
    audioUrl: BASE_URL + 'RAHORA_20230404_071200.wav',
    level: 1
},
{
    name: 'CARNSOREMET_20220822_185100',
    class: 'European Starling',
    description: '',
    audioUrl: BASE_URL + 'CARNSOREMET_20220822_185100.wav',
    level: 1
},
{
    name: 'TEEVURCHER_20220615_092500',
    class: 'European Stonechat',
    description: '',
    audioUrl: BASE_URL + 'TEEVURCHER_20220615_092500.wav',
    level: 1
},
{
    name: 'RICHFIELDM1_20230706_052800',
    class: 'Goldcrest',
    description: '',
    audioUrl: BASE_URL + 'RICHFIELDM1_20230706_052800.wav',
    level: 1
},
{
    name: 'RICHFIELDM1_20230711_061800',
    class: 'Great Tit',
    description: '',
    audioUrl: BASE_URL + 'RICHFIELDM1_20230711_061800.wav',
    level: 1
},
{
    name: 'RAHORA_20230415_184700',
    class: 'Hooded Crow',
    description: '',
    audioUrl: BASE_URL + 'RAHORA_20230415_184700.wav',
    level: 1
},
{
    name: 'TEEVURCHER_20220622_072600',
    class: 'Meadow Pipit',
    description: '',
    audioUrl: BASE_URL + 'TEEVURCHER_20220622_072600.wav',
    level: 1
},
{
    name: 'RAHORA_20230131_125700',
    class: 'Redwing',
    description: '',
    audioUrl: BASE_URL + 'RAHORA_20230131_125700.wav',
    level: 3
},
{
    name: 'RICHFIELDM1_20230724_135000',
    class: 'Rook',
    description: '',
    audioUrl: BASE_URL + 'RICHFIELDM1_20230724_135000.wav',
    level: 1
},
{
    name: 'CARNSOREMET_20220711_045900',
    class: 'Sedge Warbler',
    description: '',
    audioUrl: BASE_URL + 'CARNSOREMET_20220711_045900.wav',
    level: 1
},
{
    name: 'RICHFIELDM1_20230723_081800',
    class: 'Spotted Flycatcher',
    description: '',
    audioUrl: BASE_URL + 'RICHFIELDM1_20230723_081800.wav',
    level: 1
},
{
    name: 'CARNSOREMET_20220710_205900',
    class: 'White Wagtail',
    description: '',
    audioUrl: BASE_URL + 'CARNSOREMET_20220710_205900.wav',
    level: 3
},
{
    name: 'RICHFIELDM1_20230721_110100',
    class: 'Willow Warbler',
    description: '',
    audioUrl: BASE_URL + 'RICHFIELDM1_20230721_110100.wav',
    level: 1
},
{
    name: 'RAHORA_20230324_190800',
    class: 'Yellowhammer',
    description: '',
    audioUrl: BASE_URL + 'RAHORA_20230324_190800.wav',
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