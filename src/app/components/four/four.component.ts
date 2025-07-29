import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { fourLetter } from '../../shared/auth.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router';

@Component({
  selector: 'app-four',
  imports: [CommonModule, FormsModule],
  templateUrl: './four.component.html',
  styleUrl: './four.component.css'
})
export class FourComponent implements OnInit{
  word: string = "";
  result: string = "";
  idx: number = 0;
  fourLetterList: string[] = fourLetter;

  guesses: string[][] = Array(6).fill(null).map(() => Array(4).fill(""));
  colors: string[][] = Array(6).fill(null).map(() => Array(4).fill(""));

  activeRow: number = 0;

  constructor(public service: AuthService, private router : Router) {}

  ngOnInit(): void {
    const storedIndex = localStorage.getItem("currentIndex4");
    if (storedIndex) {
      this.idx = parseInt(storedIndex);
    } else {
      this.idx = Math.floor(Math.random() * this.fourLetterList.length);
      localStorage.setItem("currentIndex4", this.idx.toString());
    }
    this.result = this.fourLetterList[this.idx];
  }

  moveFocus(event: any, rowIndex: number, colIndex: number) {
    const input = event.target as HTMLInputElement;

    input.value = input.value.toUpperCase();
    this.guesses[rowIndex][colIndex] = input.value;

    if (input.value && colIndex < 3) {
      const inputs = input.parentElement?.querySelectorAll('input');
      const nextInput = inputs?.[colIndex] as HTMLInputElement;

      if (nextInput) {
        nextInput.value = '';
        this.guesses[rowIndex][colIndex + 1] = '';
        nextInput.focus();
      }
    }
  }

  handleBackspace(event: KeyboardEvent, rowIndex: number, colIndex: number) {
    if (event.key === 'Backspace' && !this.guesses[rowIndex][colIndex] && colIndex > 0) {
      const inputs = (event.target as HTMLInputElement).parentElement?.querySelectorAll('input');
      const prevInput = inputs?.[colIndex - 1] as HTMLInputElement;

      if (prevInput) {
        this.guesses[rowIndex][colIndex - 1] = '';
        prevInput.value = '';
        const prevv = inputs?.[colIndex - 1] as HTMLInputElement;
        setTimeout(() => prevv.focus(), 0);
      }
    }
  }

  isRight() {
    const currentGuess = this.guesses[this.activeRow].join("");
    if (currentGuess.length !== 4) {
      alert("Fill all 4 letters");
      return;
    }

    this.word = currentGuess;
    if (this.word === this.result) {
      alert("🎉 You are the winner!");
      localStorage.clear();
      if(confirm("Do you want to play another one?")) 
      {
        this.router.navigateByUrl("/home");
      }
      else window.close()
    }
    else if (this.fourLetterList.includes(this.word)) {
      const targetArr = this.result.split("");
      const guessArr = this.word.split("");
      const letterCount: { [key: string]: number } = {};

      // Count letters in result
      for (let ch of targetArr) {
        letterCount[ch] = (letterCount[ch] || 0) + 1;
      }

      for (let i = 0; i < 4; i++) {
        if (guessArr[i] === targetArr[i]) {
          this.colors[this.activeRow][i] = "green";
          letterCount[guessArr[i]]--;
        }
      }

      for (let i = 0; i < 4; i++) {
        if (this.colors[this.activeRow][i] !== "green") {
          if (letterCount[guessArr[i]] > 0) {
            this.colors[this.activeRow][i] = "yellow";
            letterCount[guessArr[i]]--;
          } else {
            this.colors[this.activeRow][i] = "black";
          }
        }
      }
      this.activeRow++;
      if(this.activeRow == 6){
        localStorage.clear();
        alert("The word is " + this.result);
        if(confirm("Do you wanna play again?")){
          this.router.navigateByUrl("/home");
        }
        else{
          window.close()
        }
      }
    }
     else {
      alert("❌ Word doesn't exist");
    }
  }
}
