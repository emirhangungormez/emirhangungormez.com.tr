const https = require('https');
const fs = require('fs');
const path = require('path');

const fetchScreenshots = (appId, prefix) => {
    https.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            try {
                const data = JSON.parse(body);
                const screenshots = data[appId].data.screenshots;
                console.log(`Found ${screenshots.length} screenshots for App ${appId}`);
                
                screenshots.forEach((s, idx) => {
                    const url = s.path_full;
                    const dest = path.join(__dirname, `${prefix}-steam-0${idx + 1}.jpg`);
                    const file = fs.createWriteStream(dest);
                    
                    https.get(url, (imgRes) => {
                        imgRes.pipe(file);
                        file.on('finish', () => {
                            file.close();
                            console.log(`Saved ${dest}`);
                        });
                    });
                });
            } catch (err) {
                console.error(err);
            }
        });
    });
};

fetchScreenshots('3411890', 'truckup');
fetchScreenshots('3849950', 'barzakh');
