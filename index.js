const PORT = 8000;
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());


/**
 * For example /get-artist-lyrics?artist=Tapio-rautavaara
 */

app.get('/get-artist-lyrics', function(req, res  ) {
    
    const artist = req.query.artist;
    const url = 'https://genius.com/' + artist;

    axios.get(url) 
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const lyrics = [];
            

            lyrics.push({
                html,
            });
            
            res.json(lyrics);
            //console.log(lyrics)

        }).catch(err => console.log(err));


});

/**
 * For example /get-lyric?lyric=Tapio-rautavaara-juokse-sina-humma-lyrics
 */

app.get('/get-lyric', function(req, res  ) {
    
    const lyricSrc = req.query.lyric;
    const url = 'https://genius.com/' + lyricSrc;
    axios.get(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const lyrics = [];
            var lyric = '';


            var title = $('h1').text(),
                title = title.replace('AboutGenius is the world’s biggest collection of song lyrics and musical knowledge', '');


            $('div[class^="Lyrics__Container"]').each(function() {
                if( $(this).html() ) {
                    lyric = lyric + $(this).html();
                }
            });

            
            $('div[class^="lyrics"]').each(function() {
                if( $(this).html() ) {
                    var lyric_text = $(this).html().replace('\n          \n            <!--sse-->\n            <p>', '');
                    var lyric_text = lyric_text.replace('</p>\n\n\n            <!--/sse-->\n          \n        ', '');
                    var lyric_text = lyric_text.replace(/\n/g, '');
                    lyric = lyric + lyric_text;
                }
            });

            lyrics.push({
                title,
                lyric,
            });
            
            res.json(lyrics);
            //console.log(lyrics)

        }).catch(err => console.log(err));
});

app.listen(PORT, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
});