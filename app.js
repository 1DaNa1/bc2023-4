const http = require('http');
const fs = require('fs');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

const port = 8000;

const server = http.createServer((req, res) => {
    try {
        // Перевіряємо URL запиту
        if (req.url === '/') {
            // Зчитуємо XML з файлу
            const xmlData = fs.readFileSync('data.xml', 'utf8');

            // Парсимо XML за допомогою fast-xml-parser
            const parser = new XMLParser();
            const jsonData = parser.parse(xmlData);

            // Формуємо новий XML
            const currencies = Array.isArray(jsonData.exchange.currency)
                ? jsonData.exchange.currency
                : [jsonData.exchange.currency];

            const newXMLData = {
                data: {
                    exchange: currencies.map((currency) => ({
                        date: currency.exchangedate,
                        rate: currency.rate,
                    })),
                },
            };

            const builder = new XMLBuilder({});
            const xmlResponse = builder.build(newXMLData);

            // Надсилаємо відповідь у форматі XML
            res.writeHead(200, { 'Content-Type': 'application/xml' });
            res.end(xmlResponse);
        } else {
            // Обробка інших URL
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    } catch (error) {
        // Обробка помилок
        console.error('Error processing request:', error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
});

// Вказуємо порт для веб-сервера
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
