import React from 'react';
import firebase from 'firebase/app';
import 'firebase/analytics';

import Player from './components/Player';
import { firebaseConfig } from './config/firebaseConfig';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
};
firebase.analytics();

function App() {
    return (
        <div className="App">
            <Player />
        </div>
    );
}

export default App;
