
<template>
<div class="container"> 
  <h1>TacTic Toe</h1>
  <div class="game">
    <div v-for="bigIndex in 9" v-bind:key="bigIndex" :id="'square_' + (bigIndex-1)" class="square" v-bind:class="{occupied:!allowed[bigIndex-1]}">    
    <div class="miniBoard">    
      <div @click="play(bigIndex-1, index-1)" v-for="index in 9" v-bind:key="index"  :id="'square_' + (index-1)" class='miniSquare' v-bind:class="{occupied:occupied[bigIndex-1][index-1]}">{{board[bigIndex-1][index-1]}}</div>
    </div>  
    </div>    
  </div>
  <h2 id="winner" v-if="complete"> Winner is {{winner}} </h2>
  <h2 v-if="tie"> Tie Game </h2>
  <button @click="resetBoard()" v-if="complete || tie">RESET</button>
</div>
</template>
<script>
import io from 'socket.io-client'
const socket = io("http://localhost:3000")
export default {
  name: 'App',
  components: {
  },
  data() {
    return {
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
      allowed:[true,true,true,true,true,true,true,true,true],
      xturn: true,
      complete: false,
      winner: null,
      tie: false
    }
  },
  methods: {
    play(bigIndex, index){
      if (this.occupied[bigIndex][index] || !this.allowed[bigIndex])
      {
        return//add null noise
      }
      socket.emit("play", index);
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
    },
  
  calculateWin(bigIndex) {
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
        this.complete = true;
        this.winner = this.board[bigIndex][first];
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
  }  
},
created() {
    socket.on("play", (msg) =>{
      //console.log("Play ", msg)
      this.draw(msg)
    })
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
