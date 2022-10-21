# ejspdf

### Explanation

Let the code speak for itself.

```js
const ejspdf = require('@swensson/ejspdf');

// This method will start an express server and
// insert params inside ejs template. It will look
// for index.ejs inside template folder and load it
// all the features (includes, img src tags, etc)
// work fine.
const pdf_file_content = await ejspdf.ejs('path/to/template/folder', 8001, {
  ...params
});

// This method will convert raw html content into pdf
// no template features included, no images import
const pdf_file_content = await ejspdf.raw('htmlstring');

// This method will convert html file into pdf,
// but you won't be able to update it's content
const pdf_file_content = await ejspdf.file('path/to/html/file');

```
