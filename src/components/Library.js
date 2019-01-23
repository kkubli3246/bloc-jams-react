import React,{Component} from 'react';
import albumData from './../data/albums';
import {Link} from 'react-router-dom';

class Library extends Component {
  constructor(props){
    super(props);
    this.state ={
      albums: albumData
    };
  }
   render() {
    return (
      <section className='library'>
        {
          this.state.albums.map((album,index) =>
            <div className ="animated bounceInRight" key={index}>
            <Link to={`/album/${album.slug}`} key={index}>
              <img className = "img-fluid" src={album.albumCover} alt={album.title} />
              <div className ="animated tada infinite slow delay-2s">{album.title}</div>
              <div className ="animated tada infinite slow delay-2s">{album.artist}</div>
              <div className ="animated tada infinite slow delay-2s">{album.releaseInfo}</div>
              <div className ="animated tada infinite slow delay-2s">{album.songs.length} songs</div>
            </Link>
            </div>
          )
        }
      </section>
     );
   }
 }
 export default Library;
