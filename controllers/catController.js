const data = require('../data/cats.json');
const breed = require('../data/breeds.json');
function getAllCatData(){
    return data;
}
function getBreedData(){
    return breed;
}
module.exports = {
    getAllCatData,
    getBreedData
}