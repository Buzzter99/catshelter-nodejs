const http = require("http");
const port = 5000;
const {
  getAllCats,
  getBreedView,
  postBreed,
  addCatView,
  searchCatData,
  getCatById,
  deleteCat, 
  saveCat,
  editCatView,
  editCat
} = require("./routes/HomeRoutes");
const fs = require("fs");
const path = require("path");
const url = require("url");
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname === "/" && req.method === "GET") {
    getAllCats(req, res);
  } else if (parsedUrl.pathname.startsWith("/content/styles")) {
    const cssPath = path.join(__dirname, req.url);
    fs.readFile(cssPath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("CSS file not found");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/css" });
      res.end(data);
    });
  } else if (parsedUrl.pathname.endsWith("/pawprint.ico")) {
    const icoPath = path.join(__dirname, req.url);
    fs.readFile(icoPath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("ICO file not found");
        return;
      }
      res.writeHead(200, { "Content-Type": "image/x-icon" });
      res.end(data);
    });
  } else if (parsedUrl.pathname.endsWith(".js")) {
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error loading JavaScript file");
        return;
      }
      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(data);
    });
  } else if (parsedUrl.pathname === "/cats/add-breed" && req.method === "GET") {
    getBreedView(req, res);
  } else if(parsedUrl.pathname.startsWith("/cats/edit") && req.method === "GET") {
    const id = parsedUrl.query.id;
    editCatView(req, res, id);
} else if(parsedUrl.pathname.startsWith("/cats/edit") && req.method === "POST") {
    editCat(req, res);
}
   else if (parsedUrl.pathname === "/cats/add-breed" && req.method === "POST") {
    res.writeHead(200, { "Content-Type": "application/json" });
    const breed = parsedUrl.query.breed;
    if (!breed) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(JSON.stringify({ message: "Breed name is required" }));
      return;
    } else {
      postBreed(breed);
      res.end(JSON.stringify({ message: "Breed added successfully" }));
    }
  } else if (parsedUrl.pathname === "/cats/add-cat" && req.method === "GET") {
    addCatView(req, res);
  } else if (parsedUrl.pathname === "/cats/add-cat" && req.method === "POST") {
    saveCat(req, res);
  }
   else if (parsedUrl.pathname === "/cats/search" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    const searchTerm = parsedUrl.query.searchTerm;
    searchCatData(req, res, searchTerm);
  }else if (req.url.startsWith('/content/images/')) {
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Image not found');
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        let contentType = 'image/jpeg';

        switch (ext) {
            case '.png':
                contentType = 'image/png';
                break;
            case '.gif':
                contentType = 'image/gif';
                break;
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.svg':
                contentType = 'image/svg+xml';
                break;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
  }
  else if(parsedUrl.pathname.startsWith("/cats/delete") && req.method === "DELETE") {
    const pathnameParts = parsedUrl.pathname.split('/');
    const id = pathnameParts[3];
    const cat = getCatById(id);
    if (cat) {
    deleteCat(cat);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Cat deleted successfully" }));

  }
   else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Cat not found" }));
  }
  }
});
try {
  server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
} catch (error) {
  console.log(error);
}
