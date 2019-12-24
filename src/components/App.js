import React from 'react';
import Navbar from './Navbar';
import '../styles/App.css';
import { Route, Switch } from 'react-router-dom';
import SongList from './SongList';
import NewPlaylistPage from './NewPlaylistPage';
import ViewPlaylistPage from './ViewPlaylistsPage';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path="/" render={() => <SongList origin='main' addToPlaylist={undefined} />} />
        <Route exact path="/viewPlaylists" render={(routeProps) => <ViewPlaylistPage {...routeProps}/>} />
        <Route exact path="/newPlaylist" render={(routeProps) => <NewPlaylistPage {...routeProps} />} />
      </Switch>
    </div>
  );
}

export default App;
