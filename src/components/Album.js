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
       currentTime: 0

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
      }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
  }

  componentWillUnmount() {
   this.audioElement.src = null;
   this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
   this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
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

                      <td className="disappear">
                        <span className={this.state.displayPlay === index ? "ion-md-play" : ""}>
                          <span className={this.state.displayPause === index ? "ion-md-pause" : "none"}>
                            {this.state.displayPlay === index || this.state.displayPause === index ? "" : index + 1 + '.'}
                          </span>
                        </span>
                      </td>

                      <td className ="">{song.title}</td>
                      <td className ="">{song.duration} seconds</td>
                    </tr>
              )}
            </tbody>
        </table>
        <PlayerBar
          isPlaying ={this.state.isPlaying}
          currentSong={this.state.currentSong}
          duration ={this.audioElement.duration}
          currentTime = {this.audioElement.currentTime}
          handleSongClick ={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick ={() => this.handlePrevClick()}
          handleNextClick ={() => this.handleNextClick()}
          handleTimeChange ={(e) => this.handleTimeChange(e)}
        />
      </section>
 );
  }

}
//
export default Album;


/*
id = {this.state.displayPlay === index || this.state.displayPause === index ? `disappear` : '' }
*/
