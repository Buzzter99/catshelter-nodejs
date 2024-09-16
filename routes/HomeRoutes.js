const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const {getAllCatData, getBreedData, filterCatData} = require('../controllers/catController');
function getAllCats(req, res) {
    const templatePath = path.join(__dirname, '../views/home/index.html');
    fs.readFile(templatePath, 'utf8', (err, templateSource) => {
        if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error loading template');
            return;
        }
        const template = handlebars.compile(templateSource);
        const data = getAllCatData();
        const html = template({ cats: data });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    });
}
function searchCatData(req, res,searchTerm) {
    const templatePath = path.join(__dirname, '../views/home/index.html');
    fs.readFile(templatePath, 'utf8', (err, templateSource) => {
        if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error loading template');
            return;
        }
        const template = handlebars.compile(templateSource);
        let data = filterCatData(searchTerm);
        if (data.length === 0) {
            data = getAllCatData();
        }
        const html = template({ cats: data });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    });
}
function getBreedView(req, res) {
    const templatePath = path.join(__dirname, '../views/addBreed.html');
        fs.readFile(templatePath, 'utf8', (err, templateSource) => {
            if (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading template');
                return;
            }
            const template = handlebars.compile(templateSource);
            const html = template();
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        });
}
function postBreed(breed){
        const filePath = path.join(__dirname, '../data/breeds.json');
        let breeds = getBreedData();
        const elementToAdd = {id: breeds.length + 1,name: breed};
        breeds.push(elementToAdd);
        const updatedData = JSON.stringify(breeds, null, 2);
        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('New breed added successfully!');
            }
        });
    };
    function addCatView(req, res) {
        const templatePath = path.join(__dirname, '../views/addCat.html');
        fs.readFile(templatePath, 'utf8', (err, templateSource) => {
            if (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading template');
                return;
            }
            const template = handlebars.compile(templateSource);
            const data = getBreedData();
            const html = template({ breeds: data });
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        });
    }
module.exports = {
    getAllCats,getBreedView,postBreed,addCatView,searchCatData
};
