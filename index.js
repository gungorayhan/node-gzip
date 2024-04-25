const express = require('express');
const compression = require('compression');
const path = require("path")

const { exec } = require('child_process');

const app = express();




function gzipFile(inputFile, outputFile) {
  return new Promise((resolve, reject) => {
    exec(`gzip -c ${inputFile} > ${outputFile}`, (error, stdout, stderr) => {
      if (error) {
        reject(`Hata oluştu: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`Hata çıktısı: ${stderr}`);
        return;
      }
      resolve(`Dosya sıkıştırıldı: ${outputFile}`);
    });
  });
}

// Kullanımı
const inputFile = path.join(__dirname, 'index.html')
const outputFile = path.join(__dirname, 'index.html.gz')

 gzipFile(inputFile, outputFile)
 .then((message) => {
    console.log(message);
  })
  .catch((error) => {
    console.error(error);
  });


// gzip sıkıştırma middleware'ini kullanma
//app.use(compression());


app.get('/', (req, res) => {
  res.set('Content-Encoding', 'gzip'); // content-encoding başlığını ekleyerek sıkıştırma kullanıldığını belirtme
  const filePath = path.join(__dirname, 'index.html.gz'); // Dosyanın tam yolunu oluşturmak için path modülünü kullanın
  res.sendFile(filePath); // sıkıştırılmış html dosyasını gönderme
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});