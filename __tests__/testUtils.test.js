//jest.mock('../../appConfig.js', () => mockValues);
const { VisSettings } = require('../__mocks__/visualization');
const MetronomeApp = require('../public/js/MetronomeApp');


describe("Testing util function", () => {
    test("testing addcompas", () => {
        // actual test
        const metronomeApp = new MetronomeApp('res/audio/',
        [ 'Low_Bongo.wav', 'Clap_bright.wav',],
        VisSettings);


// //        addCompas2(2);
//         const app = new MetronomeApp();
//         app.addCompas2(2);

    });
});

// module.exports = {
//     VisSettings,
// };
