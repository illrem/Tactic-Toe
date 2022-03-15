
<template>
<div class="container">
  <div   v-bind:class="{hidden:local||online}"> 
    <h2 > Welcome to TacticToe </h2>
    <button @click="setLocal" >Local</button>
    <button @click="setOnline()" >Online</button>    
    
    <button @click="resetBoard()" >Puzzles(coming soon)</button>
    <button @click="resetBoard()" >tutorial(coming soon)</button>
  </div>
  <div v-bind:class="{hidden:!online || onlineStart}">  
    <h1> Code: {{gameCode}}</h1>
    <button @click="setOnlineNew()" >new game</button>
    <input type="text" id="code">
    <button @click="setOnlineJoin()" >join game</button>    
    <button @click="revokeOnline()" >Back</button>
  </div>

  <div v-bind:class="{hidden:!local}">
    <h1>TacTic Toe</h1>
    <div class="game">
      <div v-for="bigIndex in 9" v-bind:key="bigIndex" :id="'square_' + (bigIndex-1)" class="square" v-bind:class="{occupied:!allowed[bigIndex-1]}">    
        <div class="miniBoard">    
          <div @click="play(bigIndex-1, index-1)" v-for="index in 9" v-bind:key="index"  :id="'square_' + (index-1)" class='miniSquare' v-bind:class="{occupied:occupied[bigIndex-1][index-1], lastMove:lastMove[bigIndex-1][index-1]}"  >{{board[bigIndex-1][index-1]}}</div>
        </div>  
        <div class="bigBoard">{{board[9][bigIndex-1]}}</div>
      </div>    
    </div>
    <h1 v-if="xturn">X's Turn</h1>
    <h1 v-if="!xturn">O's Turn</h1>
    <h2 id="winner" v-if="complete"> Winner is {{winner}} </h2>
    <h2 v-if="tie"> Tie Game </h2>
    <button @click="resetBoard()" v-if="complete || tie">RESET</button>
  </div>

  <div v-bind:class="{hidden:!online || !onlineStart}">
    <h1>TacTic Toe</h1>    
    <h1> Code: {{gameCode}}</h1>
    <div class="game">
      <div v-for="bigIndex in 9" v-bind:key="bigIndex" :id="'square_' + (bigIndex-1)" class="square" v-bind:class="{occupied:!allowed[bigIndex-1]}">    
        <div class="miniBoard">    
          <div @click="play(bigIndex-1, index-1)" v-for="index in 9" v-bind:key="index"  :id="'square_' + (index-1)" class='miniSquare' v-bind:class="{occupied:occupied[bigIndex-1][index-1], lastMove:lastMove[bigIndex-1][index-1]}"  >{{board[bigIndex-1][index-1]}}</div>
        </div>  
        <div class="bigBoard">{{board[9][bigIndex-1]}}</div>
      </div>    
    </div>
    <h1 v-if="xturn">X's Turn</h1>
    <h1 v-if="!xturn">O's Turn</h1>
    <h2 id="winner" v-if="complete"> Winner is {{winner}} </h2>
    <h2 v-if="tie"> Tie Game </h2>
    <button @click="resetBoard()" v-if="complete || tie">RESET</button>
  </div>

</div>
</template>
<script>
import io from 'socket.io-client'
const socket = io("https://serene-citadel-00320.herokuapp.com/")
export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      local:false,online:false,

      board: [["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""],
              ["","","","","","","","",""]],

      occupied: [[false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false]],

      lastMove: [[false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false]],
      allowed:[true,true,true,true,true,true,true,true,true],
      xturn: true,
      complete: false,
      winner: null,
      tie: false,

      gameCode: null,
      onlineStart: false
    }
  },
  methods: {
    play(bigIndex, index){
      if (this.occupied[bigIndex][index] || !this.allowed[bigIndex])
      {
        return//add null noise
      }
      if (this.online){
        //console.log(index);
        //console.log(bigIndex);
        socket.emit("play", { bigIndex:bigIndex, index:index});
      }
      this.draw(bigIndex, index);
    },
    draw(bigIndex, index) {
      if(this.xturn) {//if is x's turn mark as x
        this.board[bigIndex][index]="X"
      } else {//if is o's turn mark as o
        this.board[bigIndex][index]="O"
      }
      this.occupied[bigIndex][index]=true
      this.xturn = !this.xturn
      this.calculateWin([bigIndex]);
      this.calculateTie();

      //must move to selected miniboard
      for (let j = 0; j <= 8; j++){
        this.allowed[j]=false;
      }
      this.allowed[index]=true;
      this.lastMove =[[false,false,false,false,false,false,false,false,false],//reset where the last move was
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false],
                [false,false,false,false,false,false,false,false,false]];
      this.lastMove[bigIndex][index] = true;
    },
  
  calculateWin(bigIndex) {
    //console.log(bigIndex);
    if (bigIndex < 9)
    {
      if (this.board[9][bigIndex] != "")//if this board has already been won escape
      {
        return
      }
    }
    //console.log("allowed");
    const WIN_CONDITIONS = [
      [0,1,2], [3,4,5], [6,7,8], //rows
      [0,3,6], [1,4,7], [2,5,8],//columns
      [0,4,8], [2,4,6] //diagonals
    ];
    for (let i = 0; i < WIN_CONDITIONS.length; i++){
      let first = WIN_CONDITIONS[i][0];      
      let second = WIN_CONDITIONS[i][1];
      let third = WIN_CONDITIONS[i][2];
      if(this.board[bigIndex][first]==this.board[bigIndex][second] && this.board[bigIndex][first] == this.board[bigIndex][third] && this.board[bigIndex][first] != "")
      {
        //console.log(bigIndex);
        if (bigIndex == 9)
        {
          this.complete = true;
          this.winner = this.board[bigIndex][first];        
        }
        else{
          this.board[9][bigIndex] = this.board[bigIndex][first];
          this.calculateWin("9");          
        }
      }
    }
    //console.log(WIN_CONDITIONS);
  },
  resetBoard() {
    for (let i = 0; i <= 8; i++){
      for (let j = 0; j <= 8; j++){
        this.board[i][j] = "";
        this.occupied[i][j] = false;
      }
    }    
    this.complete = false;
    this.winner = "";
    this.tie = false;
    //console.log("Board Reset")
  },
  calculateTie() {// go back and move this into calc win to improve effcienecy
    for (let i = 0; i <= 8; i++){
      for (let j = 0; j <= 8; j++){
      if (this.board[i][j] == ""){///////////////////change to
        return
      }
      }
    }    
      this.tie = true;
  },
  setLocal(){
    this.local=true;
  },
  setOnline(){    
    this.online=true;
  },
  revokeOnline(){    
    this.online=false;
  },
  setOnlineNew(){
    socket.emit("newGame");     

    //this.onlineStart = true;
  },
  setOnlineJoin(){
    var code = document.getElementById("code").value;
    socket.emit("joinGame", code);   
    console.log("sent join request: " + code) 
    //this.onlineStart = true;
  },
  setGameCode(gc){
    this.gameCode = gc;
  }
},
created() {
  //if (this.online == true){

    socket.on("play",(data) => {
      //console.log("Play ", data.bigIndex);
      //console.log("Play ", data.index);
      console.log("Play");
      this.draw(data.bigIndex, data.index);
    });      

    socket.on("gameCode", (data) => {
      this.gameCode = data;
      this.setGameCode(this.gameCode);
      console.log("Gamecode returned: ", this.gameCode);
    });

    socket.on("start",(data) => {
      this.onlineStart = data;
      console.log("start game");
    });

    socket.on("Print", function(data){
      console.log(data);
    })
  //}
  }

  }
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}

.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #eee;
}

h1 {
  font-size: 5rem;
  margin-bottom: 0.5em;
}

h2 {
  margin-top: 1em;
  font-size: 2rem;
  margin-bottom: 0.5em;
}

.game {
  display: grid;
  width: 300px;
  height: 300px;
  grid-template-columns: auto auto auto;
}
.miniBoard {
  display: grid;
  width: 100px;
  height: 100px;
  grid-template-columns: auto auto auto;  
  z-index:2;
}

.bigBoard {
  font-size: 75px;
  position: absolute;
  z-index:3;
  opacity: 0.5;
}

.square {
  display: flex;
  width: 100px;
  height: 100px;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  border: 3px solid black;
}

.miniSquare {
  display: flex;  
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  border: 3px solid black;
  transition: background 0.2s ease-in-out;
}

.miniSquare:hover {
  cursor: pointer;
  background: #0ff30f;
}

.occupied:hover {
  background: #ff3a3a;
}

.lastMove {
  background: #89CFF0;
  opacity: 0.5;
}

.win {
  background: #0ff30f;
}

.win:hover {
  background: #0ff30f;
}

#square_0,
#square_1,
#square_2 {
  border-top: none;
}

#square_0,
#square_3,
#square_6 {
  border-left: none;
}

#square_6,
#square_7,
#square_8 {
  border-bottom: none;
}

#square_2,
#square_5,
#square_8 {
  border-right: none;
}

button {
  outline: none;
  border: 4px solid green;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  background: none;
  transition: all 0.2s ease-in-out;
}

button:hover {
  cursor: pointer;
  background: green;
  color: white;
}

.playerWin {
  color: green;
}

.computerWin {
  color: red;
}

.draw {
  color: orangered;
}
.hidden{
  display:none;
}

@media only screen and (max-width: 600px) {

  h1 {
    font-size: 3rem;
    margin-bottom: 0.5em;
  }

  h2 {
    margin-top: 1em;
    font-size: 1.3rem;
  }
}
</style>
