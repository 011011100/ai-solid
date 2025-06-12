/* @refresh reload */
import {render} from 'solid-js/web'
import {Route, Router} from "@solidjs/router";
import App from "./app.tsx";
import "./index.css";
import Chat from "./pages/chat.tsx";
import Layout from "./layout/layout.js";


render(
    () => (
        <Layout>
            <Router>
                <Route path="/Chat" component={Chat}/>
                <Route path="/" component={App}/>
            </Router>
        </Layout>
    ),
    document.getElementById('root')!
)
