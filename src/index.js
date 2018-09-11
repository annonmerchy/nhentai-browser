import React from "react";
import ReactDOM from "react-dom";
import {HashRouter,Route,Switch} from "react-router-dom";

import {Root} from "./Root";
import {NavBar} from "./components/nav_bar";
import GallerySearcher from "./components/gallery_searcher";
import GalleryPage from "./components/gallery_page";
import GalleryReader from "./components/gallery_reader";

import "./style.css";

ReactDOM.render(
    <Root>
        <div>
            <HashRouter>
                <div>
                    <NavBar />
                    <Switch>
                        <Route path="/g/:id/:page" component={GalleryReader} />
                        <Route path="/g/:id" component={GalleryPage} />
                        <Route path="/query/:query?/:page?" component={GallerySearcher} />
                        <Route path="/:page?" component={GallerySearcher} />
                    </Switch>
                </div>
            </HashRouter>
        </div>
    </Root>
    , document.querySelector(".container"));