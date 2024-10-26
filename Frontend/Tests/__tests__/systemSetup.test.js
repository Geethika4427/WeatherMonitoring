// const { startApp } = require('../../Backend/Server.js'); // replace with your app's entry point

// test('System starts successfully and connects to OpenWeatherMap API', async () => {
//     const app = await startApp(); // assume this initializes the app and connects to the API
//     expect(app).toBeDefined();
//     expect(app.apiClient).toBeTruthy(); // Ensure the API client is initialized
// });

// ;
const path = require('path');

// Log the absolute path to the console
const serverPath = path.resolve(__dirname, '../../Backend/Server.js');
console.log('Attempting to require module at:', serverPath);

// Use the correct path to your Server.js file
const { startApp } = require(serverPath);
