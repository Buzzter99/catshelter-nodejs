const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const {getAllCatData, getBreedData, filterCatData, getCatById} = require('../controllers/catController');
const formidable = require('formidable');
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

    function deleteCat(cat){
        const filePath = path.join(__dirname, '../data/cats.json');
        let breeds = getAllCatData();
        breeds = breeds.filter((c) => c.id !== cat.id);
        const updatedData = JSON.stringify(breeds, null, 2);
        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.log('Error writing to file:', err);
            } else {
                console.log('Cat deleted successfully!');
            }
        });
    };
    function saveCat(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error parsing the form: ' + err);
            return;
        }
        const name = fields.name[0];
        const breed = fields.breed[0];
        const description = fields.description[0];
        if (!name || !breed || !description || !files.upload) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Missing required fields');
            return;
        }
        const uploadedFile = files.upload[0]; 
        if (!uploadedFile) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('No file uploaded');
            return;
        }
        const oldPath = uploadedFile.filepath; 
        const newDir = path.join(__dirname, '../content', 'images');
        const newPath = path.join(newDir, uploadedFile.originalFilename);
        if (!fs.existsSync(newDir)) {
            fs.mkdirSync(newDir);
        }
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error saving the file: ' + err);
                return;
            }
            const cat = { name, breed, description, image: '../../content/images/' + uploadedFile.originalFilename };
            saveCatToDb(cat);
            res.writeHead(302, { Location: '/' });
            res.end();
        });
    });
    }
    function saveCatToDb(cat) {
        const filePath = path.join(__dirname, '../data/cats.json');
        let cats = getAllCatData();
        const elementToAdd = {
            id: cats.length > 0 ? cats[cats.length - 1].id + 1 : 1,name: cat.name,breed: cat.breed,description: cat.description,image: cat.image
        };
        cats.push(elementToAdd); 
        const updatedData = JSON.stringify(cats, null, 2);
    
        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('New breed added successfully!');
            }
        });
    }

    function editCatView(req, res,id) {
        const templatePath = path.join(__dirname, '../views/editCat.html');
        fs.readFile(templatePath, 'utf8', (err, templateSource) => {
            if (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading template');
                return;
            }
            const template = handlebars.compile(templateSource);
            const catData = getCatById(id);
            const html = template({ catData: catData,breeds:getBreedData() });
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        });
    }
module.exports = {
    getAllCats,getBreedView,postBreed,addCatView,searchCatData,getCatById,deleteCat,saveCat,editCatView
};
