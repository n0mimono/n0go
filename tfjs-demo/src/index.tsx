import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './store'

import App from './containers/App'

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.querySelector('.app')
)
