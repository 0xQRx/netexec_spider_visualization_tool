const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Configuration for multer (file upload handling)
const upload = multer({ 
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname) !== '.json') {
            return cb(new Error('Only JSON files are allowed'), false);
        }
        cb(null, true);
    }
});


const generateFileTreeHTML = (data) => {
    let html = '<ul class="file-tree">';
    for (const key in data) {
        if (data[key] !== null && typeof data[key] === 'object' && !data[key].hasOwnProperty('size')) {
            // Recursive call for nested objects
            html += `<li><span class="folder">${key}</span>${generateFileTreeHTML(data[key])}</li>`;
        } else {
            // Extract filename from the path for bolding
            let displayKey = key;
            // Check if the key contains a path with '/'
            if (key.includes('/')) {
                const parts = key.split('/');
                const fileName = parts.pop(); // Extract the filename
                const pathWithoutFile = parts.join('/'); // Re-join the remaining path without the filename
                displayKey = `${pathWithoutFile}/<b>${fileName}</b>`;
            } else {
                // If not a nested path, bold the entire key
                displayKey = `<b>${key}</b>`;
            }
            html += `<li class="file">${displayKey} - Size: ${data[key].size}, Last Modified: ${new Date(data[key].mtime_epoch).toISOString()}</li>`;
        }
    }
    html += '</ul>';
    return html;
};


// Upload route
// Adjusted upload route to handle multiple file uploads
app.post('/upload', upload.array('file', 100), (req, res) => { // Allowing up to 10 files
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // Process each file in req.files
    req.files.forEach(file => {
        const tempPath = file.path;
        const targetPath = `uploads/${file.originalname}`;

        fs.rename(tempPath, targetPath, err => {
            if (err) {
                console.error('Error moving file:', file.originalname, err);
                // Depending on your preference, you might want to stop processing or just log the error
            }
        });
    });

    // Redirect or respond after all files are processed
    res.redirect('/');
});


// Route to display the file tree
app.get('/', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
            res.status(500).send('Error reading uploads directory');
            return;
        }
        // Inside your route that lists the files...
	let html = files.filter(file => path.extname(file) === '.json')
	    // Example of generating buttons with icons
		.map(file => `<li>${path.basename(file)} 
		<a href="/file/${path.basename(file, '.json')}" class="view-btn"><i class="fas fa-eye"></i>View</a> 
		<button onclick="deleteFile('${path.basename(file)}')" class="delete-btn small-btn"><i class="fas fa-trash-alt"></i></button></li>`)
		.join('');


        res.send(`<html><head><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
<link rel="stylesheet" type="text/css" href="style.css"></head><body><ul>${html}</ul><form action="/upload" method="post" enctype="multipart/form-data"><input type="file" name="file" multiple><button type="submit">Upload JSON File</button></form><button onclick="clearAllData()" class="clear-all-btn"><i class="fas fa-broom"></i>Clear All Data</button><script src="script.js"></script></body></html>`);
    });
});

// Route to display content of a specific JSON file without the .json extension in URL
app.get('/file/:name', (req, res) => {
    // Append .json extension programmatically
    const fileName = `${req.params.name}.json`;
    const filePath = `uploads/${fileName}`;
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(500).send('Error reading JSON file');
            return;
        }
        try {
            const jsonData = JSON.parse(data);
            const fileTreeHTML = generateFileTreeHTML(jsonData);
            res.send(`<html><head><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
<link rel="stylesheet" type="text/css" href="/style.css"></head><body>${fileTreeHTML}<a href="/">Back</a><script src="/script.js"></script></body></html>`);
        } catch (error) {
            res.status(500).send('Error parsing JSON file');
        }
    });
});

app.delete('/delete/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join('uploads', fileName);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting file');
            return;
        }
        res.status(200).send('File deleted successfully');
    });
});

app.delete('/clear-all', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading directory');
            return;
        }

        files.forEach(file => {
            fs.unlink(path.join('uploads', file), err => {
                if (err) {
                    console.error(err);
                    // Optionally, send a failure response or log the error
                }
            });
        });

        res.status(200).send('All files deleted successfully');
    });
});




app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
