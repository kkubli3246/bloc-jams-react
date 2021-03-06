import  React,{Component} from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

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
       displayPause: '',

       duration: album.songs[0].duration,
       currentTime: 0,

       volume: album.songs[0].volume,
       currentVolume: .8

     };

     this.audioElement = document.createElement('audio');
     this.audioElement.src = album.songs[0].audioSrc;

   }

   componentDidMount = () => {
     this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      },
      volumechange: e => {
        this.setState({volume: this.audioElement.volume});
      }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.addEventListener('volumechange', this.eventListeners.volumechange);
  }

  componentWillUnmount() {
   this.audioElement.src = null;
   this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
   this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
   this.audioElement.removeEventListener('volumechange', this.eventListeners.volumechange);
 }

   play(){
     this.audioElement.play();
     this.setState({isPlaying: true});

   }

   pause(){
     this.audioElement.pause();
     this.setState({isPlaying: false});

   }

   setSong(song){
     this.audioElement.src = song.audioSrc;
     this.setState({currentSong: song});

   }

   handleSongClick(song, index){
     const isSameSong = this.state.currentSong === song;
     if(this.state.isPlaying && isSameSong){
       this.pause(index);
       this.setState({displayPlay: index});
       this.setState({displayPause: ''});
     }else
       {
         if(!isSameSong){this.setSong(song); }
         this.play(index);
         this.setState({displayPause: index});
         this.setState({displayPlay: ''});
       }
   }

   handlePrevClick(){
     const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
     const newIndex = Math.max(0, currentIndex - 1);
     const newSong = this.state.album.songs[newIndex];
     this.setSong(newSong);
     this.play();
   }

   handleNextClick(){
     const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
     const newIndex = Math.min(this.state.album.songs.length - 1, currentIndex + 1);
     const newSong = this.state.album.songs[newIndex];
     this.setSong(newSong);
     this.play();
   }


   handleTimeChange = (e) => {
     const newTime = this.audioElement.duration * e.target.value;
     this.audioElement.currentTime = newTime;
     this.setState({ currentTime: newTime });

   }

   handleVolumeChange = (e) => {
     const newVol = e.target.value;
     this.audioElement.volume = newVol;
     this.setState({volume: newVol});
   }

   formatTime = (time) => {
     const mins = Math.floor(time / 60);
     let sec = Math.floor(time % 60);
     if(sec < 10){sec = "0" + sec;}
      return mins + ":" + sec;}

   handleMouseEnter = (index) => {
      this.setState({displayPlay: index});
      if(this.state.displayPause === index){this.setState({displayPause: ""});
      }
    }


   handleMouseLeave = (song, index) => {
     const isSameSong = this.state.currentSong === song;
     if(isSameSong && this.state.isPlaying){
       this.setState({displayPause: index});
     }
     this.setState({displayPlay: ""});

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
        <div className = "container">
          <div className ="row">
            

            
        <table className = "steelBlueCols" id="song-list col-2">
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

                      <td className="disappear">
                        <span className={this.state.displayPlay === index ? "ion-md-play" : ""}>
                          <span className={this.state.displayPause === index ? "ion-md-pause" : "none"}>
                            {this.state.displayPlay === index || this.state.displayPause === index ? "" : index + 1 + '.'}
                          </span>
                        </span>
                      </td>

                      <td className ="">{song.title}</td>
                      <td className ="">{this.formatTime(song.duration)}</td>
                    </tr>
              )}
            </tbody>
        </table>
         <div className="col-2"></div>
        <div className="playerbar col-3">
        <PlayerBar
          isPlaying ={this.state.isPlaying}
          currentSong={this.state.currentSong}

          duration ={this.audioElement.duration}
          currentTime = {this.audioElement.currentTime}

          currentVolume={this.audioElement.currentVolume}
          volume={this.audioElement.volume}

          formatTime={this.formatTime}

          handleSongClick ={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick ={() => this.handlePrevClick()}
          handleNextClick ={() => this.handleNextClick()}
          handleTimeChange ={(e) => this.handleTimeChange(e)}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
        />
        </div>
        </div>
        </div>
      </section>
 );
  }
}
export default Album;



