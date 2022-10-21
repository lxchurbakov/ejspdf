const fs = require('fs');
const express = require('express');
const puppeteer = require('puppeteer');

const convert_to_pdf = async (puppeteer_navigation_predicate) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await Promise.all([
    puppeteer_navigation_predicate(page),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);

  const pdf = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  return pdf;
};

module.exports = {
  ejs: async (template_path, port, params) => {
    const app = express();

    app.set('view engine', 'ejs');
    app.set('views', template_path);

    app.use('/', express.static(template_path));
    app.get('/', (req, res) => res.render('index', params));

    const server = await new Promise((resolve, reject) => {
      const intermediate_server_value = app.listen(port, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(intermediate_server_value);
        }
      });
    });

    const pdf = await convert_to_pdf((p) => p.goto(`http://localhost:${port}`));

    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    });

    return pdf;
  },
  raw: async (content) => {
    return convert_to_pdf((p) => p.setContent(content));
  },
  file: async (file_path) => {
    return convert_to_pdf((p) => p.goto(`file://${file_path}`));
  },
};
