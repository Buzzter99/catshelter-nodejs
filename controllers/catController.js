const data = require('../data/cats.json');
const breed = require('../data/breeds.json');
function getAllCatData(){
    return data;
}
function getBreedData(){
    return breed;
}
function filterCatData(condition){
    return data.filter((cat) => cat.breed.toUpperCase().includes(condition.toUpperCase()) 
    || cat.name.toUpperCase().includes(condition.toUpperCase()) 
    || cat.description.toUpperCase().includes(condition.toUpperCase()));
}
module.exports = {
    getAllCatData,
    getBreedData,
    filterCatData
}