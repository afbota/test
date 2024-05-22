const axios = require('axios');

module.exports = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).send("Error: 'id' query parameter is required.");
    return;
  }

  const urlForDomain = `http://xtv.ooo:8080/live/zubair9798/zubair9799/${id}.m3u8`;

  try {
    const responseForDomain = await axios.get(urlForDomain, {
      headers: {
        "User-Agent": "OTT Navigator/1.6.7.4 (Linux;Android 11) ExoPlayerLib/2.15.1",
        "Host": "xtv.ooo:8080",
        "Connection": "Keep-Alive",
        "Accept-Encoding": "gzip"
      },
      maxRedirects: 0,
      validateStatus: status => status < 400 || status === 302
    });

    if (responseForDomain.status === 302) {
      const locationUrl = responseForDomain.headers.location;
      const domain = new URL(locationUrl).hostname;

      const urlForM3u8 = `http://xtv.ooo:8080/live/zubair9798/zubair9799/${id}.m3u8`;

      const responseForM3u8 = await axios.get(urlForM3u8, {
        headers: {
          "User-Agent": "OTT Navigator/1.6.7.4 (Linux;Android 11) ExoPlayerLib/2.15.1",
          "Host": "xtv.ooo:8080",
          "Connection": "Keep-Alive",
          "Accept-Encoding": "gzip"
        },
        validateStatus: status => status < 500
      });

      if (responseForM3u8.status === 200) {
        const modifiedResponseTextForM3u8 = responseForM3u8.data.replace(/\/hlsr\//g, `http://${domain}/hlsr/`);
        res.status(200).send(modifiedResponseTextForM3u8);
      } else if (responseForM3u8.status === 403) {
        res.status(403).send("Error: 403 Forbidden");
      } else {
        res.status(500).send(`Error: ${responseForM3u8.status}`);
      }
    } else {
      res.status(500).send(`Error extracting domain: ${responseForDomain.status}`);
    }
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
};
