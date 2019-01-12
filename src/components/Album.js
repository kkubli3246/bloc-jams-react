import  React,{Component} from 'react';
import albumData from './../data/albums';

class Album extends Component {
   constructor(props) {
     super(props);

     const album = albumData.find( album => {
       return album.slug === this.props.match.params.slug
     });


     this.state = {
       album: album,
       currentSong : album.songs[0],
       isPlaying: false,
       displayPlay: '',
       displayPause: ''

     };

     this.audioElement = document.createElement('audio');
     this.audioElement.src = album.songs[0].audioSrc;

   }

   play(){
     this.audioElement.play();
     this.setState({isPlaying: true});
   }

   pause(){
     this.audioElement.pause();
     this.setState({isPlaying: false});

   }

   setSong(song, index){
     this.audioElement.src = song.audioSrc;
     this.setState({currentSong: song});

   }

   handleSongClick(song, index){
     const isSameSong = this.state.currentSong === song;
     if(this.state.isPlaying && isSameSong){
       this.pause();
       this.setState({displayPlay: index});
       this.setState({displayPause: ''});
     }else
       {
         if(!isSameSong){this.setSong(song); }
         this.play();
         this.setState({displayPause: index});
         this.setState({displayPlay: ''});
       }
   }


   handleMouseEnter = (song, index) => {
      const isSameSong = this.state.currentSong === song;
      if(!isSameSong){
          this.setState({displayPlay: index});
        }
      else if(isSameSong && !this.state.isPlaying){
        this.setState({displayPlay: index});
        this.setState({displayPause: ''});
      }
    }


   handleMouseLeave = (song, index) => {
     const isSameSong = this.state.currentSong === song;
     if(isSameSong && !this.state.isPlaying){
       this.setState({displayPlay: index})
     }
     this.setState({displayPlay: ''})
    }



  render(){
    return(
      <section className="album">

        <section id="album-info">
            <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
            <div className="album-details">
              <h1 id="album-title">{this.state.album.title}</h1>
              <h2 className="artist">{this.state.album.artist}</h2>
              <div id="release-info">{this.state.album.releaseInfo}</div>
            </div>
        </section>
        <table id="song-list">
            <colgroup>
                <col id="song-number-column" />
                <col id="song-title-column" />
                <col id="song-duration-column" />
            </colgroup>
            <tbody>
              {
                this.state.album.songs.map((song,index) =>
                    <tr key={index}
                      onClick={() => this.handleSongClick(song, index)}
                      onMouseEnter={() => this.handleMouseEnter(song, index)}
                      onMouseLeave={() => this.handleMouseLeave(song,index)}
                      >

                      <span
                        className={this.state.currentSong === song && !this.state.isPlaying || this.state.displayPlay === index ? "ion-md-play" : "none"}>
                      </span>
                      <span
                        className={this.state.displayPause === index ? "ion-md-pause" : "none"}>
                      </span>
                      <td style ={{display: this.state.displayPlay === index || this.state.displayPause === index ? `none` : '' }}>{index + 1}</td>

                      <td className ="">{song.title}</td>
                      <td className ="">{song.duration} seconds</td>
                    </tr>
              )}
            </tbody>
        </table>
      </section>
 );
  }

}

export default Album;


/*

*/
