
import { h, render } from 'preact';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Settings } from 'luxon';
import { Provider } from 'react-redux';
import { persistor, store } from './store';
import { Footer } from './Footer';

import { HomeView } from './HomeView';
import { EntryEditView } from './EntryEditView';
import { EntryDeleteView } from './EntryDeleteView';
import { ClearView } from './ClearView';
import { ExportView } from './ExportView';
import { ConfigNewView, ConfigEditView, TemplateEditView } from './ConfigEditView';
import { SettingsView } from './SettingsView';
import { TemplatesView } from './TemplatesView';

Settings.defaultLocale = "en-AU";

function App() {
    return (
        <PersistGate persistor={persistor}>
        <Provider store={store}>
        <BrowserRouter>
            <header className="header">
                <h1>
                    <img
                        src="/bugman_logo.svg"
                        className="logo"
                    />
                    <span>Field Assistant</span>
                    <img
                        src="/bugman_logo.svg"
                        className="logo flip"
                    />
                </h1>
            </header>
            <Switch>
                <Route exact path="/">
                    <HomeView/>
                </Route>
                <Route exact path="/settings">
                    <SettingsView/>
                </Route>
                <Route path="/config/edit">
                    <ConfigEditView />
                </Route>
                <Route path="/config/new">
                    <ConfigNewView/>
                </Route>
                <Route exact path="/templates">
                    <TemplatesView/>
                </Route>
                <Route path="/templates/:index">
                    <TemplateEditView />
                </Route>
                <Route exact path="/new">
                    <EntryEditView/>
                </Route>
                <Route exact path="/clear">
                    <ClearView/>
                </Route>
                <Route exact path="/export">
                    <ExportView/>
                </Route>
                <Route exact path="/:entry_id">
                    <HomeView/>
                </Route>
                <Route path="/:entry_id/edit">
                    <EntryEditView/>
                </Route>
                <Route path="/:entry_id/delete">
                    <EntryDeleteView/>
                </Route>
            </Switch>
            <Footer/>
        </BrowserRouter>
        </Provider>
        </PersistGate>
    )
}

if (process.env.NODE_ENV === "production") {
    if ('serviceWorker' in navigator) runtime.register();
}

render(<App/>, document.getElementById('root') as HTMLElement);
