//import MetronomePlayer from '../public/js/MetronomePlayer';
import MetronomeEditor from '../public/js/MetronomeEditor';
import VisSettings from '../__mocks__/visualization';

describe("Testing util function", () => {
    test("testing addcompas", () => {
        // actual test
        // const thePlayer = new MetronomePlayer('res/audio/',
        //     [ 'Low_Bongo.wav', 'Clap_bright.wav',],
        //     VisSettings);
        const theEditor = new MetronomeEditor('res/audio/',
            [ 'Low_Bongo.wav', 'Clap_bright.wav',],
            VisSettings);

// //        addCompas2(2);
//         const app = new MetronomeEditor();
//         app.addCompas2(2);
    });
});

