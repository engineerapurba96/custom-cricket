import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MockDataService } from '../../shared/services/mock-data/mock-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash';

@Component({
  selector: 'app-score-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './score-card.component.html',
  styleUrl: './score-card.component.scss',
})
export class ScoreCardComponent {

  teamA: any = {};
  teamB: any = {};
  currentBattingTeam = 0;
  currentBowlingTeam = 1;
  totalOvers = 0;
  firstInningsOver = false;
  secondInningsOver = false;
  matchResult = '';
  currentStriker: string = '';
  currentNonStriker: string = '';
  currentBowler: string = '';

  scheduleIndex: any;
  scheduleDet: any;
  _: any = _;


  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private mockService: MockDataService) {
    const localStoragePlayers = JSON.parse(localStorage.getItem('players') || '[]');
    this.scheduleIndex = this.route.snapshot.paramMap.get('id');
    const savedSchedules = localStorage.getItem('schedules');
    if (savedSchedules) {
      const scheduleDet = JSON.parse(savedSchedules);  // Load saved schedules from localStorage
      this.scheduleDet = scheduleDet[this.scheduleIndex];
    }
    this.totalOvers = this.scheduleDet.matchsetup.overs;
    this.teamA['score'] = Array.from({ length: this.totalOvers }, (_, i) => ({
      overNumber: i + 1,
      scoreCard: Array(6).fill(''),
    }));
    this.teamB['score'] = Array.from({ length: this.totalOvers }, (_, i) => ({
      overNumber: i + 1,
      scoreCard: Array(6).fill(''),
    }));
    this.scheduleDet.matchsetup.teamA.players = this.updatePlayerDetails(
      this.scheduleDet.matchsetup.teamA.players,
      localStoragePlayers
    );
    this.scheduleDet.matchsetup.teamA['score'] = Array.from({ length: this.totalOvers }, (_, i) => ({
      overNumber: i + 1,
      scoreCard: Array(6).fill(''),
    }));
    this.scheduleDet.matchsetup.teamB['score'] = Array.from({ length: this.totalOvers }, (_, i) => ({
      overNumber: i + 1,
      scoreCard: Array(6).fill(''),
    }));
    this.scheduleDet.matchsetup.teamB.players = this.updatePlayerDetails(
      this.scheduleDet.matchsetup.teamB.players,
      localStoragePlayers
    );
    this.teamA.players = this.scheduleDet.matchsetup.teamA.players;
    this.teamB.players = this.scheduleDet.matchsetup.teamB.players;
    // this.getMatchSetup();
  }

  updatePlayerDetails(playerIds: string[], fullPlayerData: any[]): any[] {
    return playerIds.map(playerId =>
      fullPlayerData.find(player => player.id === playerId) || { id: playerId, name: 'Unknown' }
    );
  }

  getMatchSetup() {
    this.scheduleDet.matchsetup.teamA.runs = 0;
    this.scheduleDet.matchsetup.teamA.over = this.totalOvers;
    this.scheduleDet.matchsetup.teamB.over = this.totalOvers;
    this.scheduleDet.matchsetup.teamB.runs = 0;
    // this.totalOvers = this.scheduleDet.matchsetup.overs;
    // this.scheduleDet.matchsetup.teamA.players = this.scheduleDet.matchsetup.teamA.players.map((player: any, index: any) => ({
    //   Player_id: player?.Player_id,
    //   Player_name: player?.Player_name,
    //   runs: 0,
    //   ballsFaced: 0,
    //   isOut: false,
    //   fours: 0,
    //   sixes: 0,
    //   bowling: 0,
    //   wickets: 0,
    //   bowlRun: 0,
    //   bowlFour: 0,
    //   bowlSix: 0,
    //   wide: 0,
    //   nb: 0,
    // }));
    // this.scheduleDet.teamA.score = Array.from({ length: this.totalOvers }, (_, i) => ({
    //   overNumber: i + 1,
    //   scoreCard: Array(6).fill(''),
    // }));
    // this.scheduleDet.teamA.totalRuns = 0;
    // this.scheduleDet.teamA.wickets = 0;
    // this.scheduleDet.teamA.extras = 0;
    // this.scheduleDet.teamA.totalOvers = this.totalOvers;
    // this.scheduleDet.teamB.players = this.scheduleDet.teamB.players.map((player: any, index: any) => ({
    //   Player_id: player.Player_id,
    //   Player_name: player.Player_name,
    //   runs: 0,
    //   ballsFaced: 0,
    //   isOut: false,
    //   fours: 0,
    //   sixes: 0,
    //   bowling: 0,
    //   wickets: 0,
    //   bowlRun: 0,
    //   bowlFour: 0,
    //   bowlSix: 0,
    //   wide: 0,
    //   nb: 0,
    // }));
    // this.scheduleDet.teamB.score = Array.from({ length: this.totalOvers }, (_, i) => ({
    //   overNumber: i + 1,
    //   scoreCard: Array(6).fill(''),
    // }));
    // this.scheduleDet.teamB.totalRuns = 0;
    // this.scheduleDet.teamB.wickets = 0;
    // this.scheduleDet.teamB.extras = 0;
    // this.scheduleDet.totalOvers = this.totalOvers;
    // this.teamA = this.scheduleDet.teamA;
    // this.teamB = this.scheduleDet.teamB;
    return this.scheduleDet;
  }
  updatePlayerRun(run:any){
    console.log(run);
    const currentTeam = this.currentBattingTeam === 0 ? this.scheduleDet.matchsetup.teamA : this.scheduleDet.matchsetup.teamB;
    currentTeam.ballsFaced = currentTeam.ballsFaced ? currentTeam.ballsFaced + 1: 1;
    currentTeam.run = currentTeam.run ? currentTeam.run + 1: 1;
    const striker = currentTeam.players.find(
      (player: any) => player.name === this.currentStriker
    );
    striker.ballsFaced += 1;
    striker.run = striker.run ? striker.run + run : run;
    if (run===6) striker.num6s += 1;
    if (run===4) striker.num4s += 1;
  }

  ballResult(runs?: number | string, extraType?: string) {
    if (!this.currentStriker || !this.currentNonStriker || !this.currentBowler) {
      alert('Please select  Striker, Non-Striker & Bowler');
      return;
    }
    // const currentTeam = this.currentBattingTeam === 0 ? this.teamA : this.teamB;
    const currentTeam = this.currentBattingTeam === 0 ? this.scheduleDet.matchsetup.teamA : this.scheduleDet.matchsetup.teamB;
    const currentOver = currentTeam.score.find((over: any) =>
      over.scoreCard.includes('')
    );
    if (!currentOver) {
      console.log('All overs are completed!');
      alert('All overs are completed!');
      return;
    }

    if (_.isUndefined(extraType) && !_.isUndefined(runs)) {
      this.updateBolwerRuns(runs);
      this.updatePlayerRuns(runs, currentTeam);
    }
    else if (!_.isUndefined(extraType)) {
      // currentTeam.extras = currentTeam.extras?currentTeam.extras+1 : 1;
      currentOver.scoreCard.push('');
    }
    else {
      this.updateBolwerRuns('W');
      // this.updatePlayerRuns('W', currentTeam);
    }
    const ballIndex = currentOver.scoreCard.findIndex(
      (ball: any) => ball === ''
    );
    if (ballIndex !== -1) {
      currentOver.scoreCard[ballIndex] = runs;
      if (typeof runs === 'number' && _.isUndefined(extraType)) {
        if (runs === 1) {
          this.switchStriker();
        }
        currentTeam.totalRuns = currentTeam.totalRuns? currentTeam.totalRuns + runs : runs;
      } else if (extraType === 'WD' || extraType === 'NB') {
        currentOver.scoreCard[ballIndex] = extraType;
        currentTeam.extras = currentTeam.extras?currentTeam.extras+1:1;
        currentTeam.totalRuns = currentTeam.totalRuns? currentTeam.totalRuns + runs : runs;
        this.updateBolwerRuns(extraType);
      } else {
        currentOver.scoreCard[ballIndex] = 'W';
        currentTeam.wickets = currentTeam.wickets?currentTeam.wickets+1:1;
        if ((this.getCurrentTeamPlayers().length - 1) == currentTeam.wickets) {
          if (this.firstInningsOver) this.determineMatchResult();
          else this.startNextInnings();
        }
      }
      if (_.isEmpty(currentTeam.score.find((over: any) => over.scoreCard.includes('')))) {
        if (this.firstInningsOver) this.determineMatchResult();
        else this.startNextInnings();
      }
    } else {
      console.log('This over is already complete!');
    }
    console.log(currentOver);
    console.log(currentOver.scoreCard);
    const filteredOver = currentOver.scoreCard.filter((item: any) => item !== 'WD' && item !== 'NB' && item !== '');
    console.log(filteredOver.length);
    if (filteredOver.length == 6) {
      this.currentBowler = '';
      this.switchStriker();
    }

  }
  updateBolwerRuns(runs: any){
    const currentTeam = this.currentBattingTeam === 0 ? this.scheduleDet.matchsetup.teamA : this.scheduleDet.matchsetup.teamB;
    const bolwer = currentTeam.players.find(
      (player: any) => player.name === this.currentStriker
    );
    bolwer.bowling +=1;
    if (runs === 'W') {
      bolwer.bowllerRun = bolwer.bowllerRun?bolwer.bowllerRun+1:1;
      bolwer.numWickets += 1;
      return
    }
    if (runs === 'WD') {
      bolwer.bowllerRun = bolwer.bowllerRun?bolwer.bowllerRun+1:1;
      bolwer.wide += 1;
      return
    }
    if (runs === 'NB') {
      bolwer.bowllerRun = bolwer.bowllerRun?bolwer.bowllerRun+1:1;
      bolwer.nb += 1;
      return
    }
    if (runs === 6) bolwer.num6sBowled += 1;
    if (runs === 4) bolwer.num4sBowled += 1;
    bolwer.bowllerRun = bolwer.bowllerRun?bolwer.bowllerRun+1:1;
  }
  updatePlayerRuns(runs: number | string, currentTeam: any) {
    const striker = currentTeam.players.find(
      (player: any) => player.name === this.currentStriker
    );
    if (runs === 'W') {
      this.currentStriker = '';
      if (striker) striker.isOut = true;
      //this.switchStriker();
    } else {
      if (runs === 6) striker.num6s += 1;
      if (runs === 4) striker.num4s += 1;
      if (striker) striker.bowlRun += runs;
    }
    striker.run = striker.run ? striker.run + runs : runs;
    if (runs===6) striker.num6s += 1;
    if (runs===4) striker.num4s += 1;
    if (striker) striker.ballsFaced += 1;
  }
  startNextInnings() {
    this.firstInningsOver = true;
    this.currentBowlingTeam = this.currentBowlingTeam === 0 ? 1 : 0;
    this.currentBattingTeam = this.currentBattingTeam === 0 ? 1 : 0;
    this.currentStriker = '';
    this.currentNonStriker = '';
    alert(`First innings over! ${this.scheduleDet.teamA.team_name} scored ${this.scheduleDet.matchsetup.teamA.totalRuns} runs for ${this.scheduleDet.matchsetup.teamA.wickets??0}`);
  }
  determineMatchResult() {
    if (this.scheduleDet.matchsetup.teamB.totalRuns > this.scheduleDet.matchsetup.teamA.totalRuns) {
      this.matchResult = `${this.scheduleDet.teamB.team_name} wins by ${this.scheduleDet.matchsetup.teamB.totalRuns - this.scheduleDet.matchsetup.teamA.totalRuns
        } runs!`;
    } else if (this.scheduleDet.matchsetup.teamA.totalRuns > this.scheduleDet.matchsetup.teamB.totalRuns) {
      this.matchResult = `${this.scheduleDet.teamA.team_name} wins by ${this.scheduleDet.matchsetup.teamA.totalRuns - this.scheduleDet.matchsetup.teamB.totalRuns
        } runs!`;
    } else {
      this.matchResult = `The match is a draw!`;
    }
    this.secondInningsOver = true;
    alert(this.matchResult);
  }
  getCurrentTeamPlayers() {
    return this.scheduleDet.matchsetup[this.currentBattingTeam === 0 ? 'teamA' : 'teamB'].players;
  }  
  getCurrentBowlPlayers() {
    return this.scheduleDet.matchsetup[this.currentBowlingTeam === 0 ? 'teamA' : 'teamB'].players;
  }
  switchStriker() {
    const temp = this.currentStriker;
    this.currentStriker = this.currentNonStriker;
    this.currentNonStriker = temp;
  }
  resetMatch() {
    this.teamA.totalRuns = 0;
    this.teamB.totalRuns = 0;
    this.teamA.wickets = 0;
    this.teamB.wickets = 0;
    this.teamA.extras = 0;
    this.teamB.extras = 0;
    this.teamA.score = [];
    this.teamB.score = [];
    this.firstInningsOver = false;
    this.secondInningsOver = false;
    this.matchResult = '';
    this.currentBattingTeam = 0;
  }
  save_score() {
    let score = [this.teamA, this.teamB];
    localStorage.setItem('live_cricket_score', JSON.stringify(score));
    const schedules = this.mockService.getSchedules();
    const teamA_Balls_faced = _.sum(_.map(this.teamA.players, 'ballsFaced'));
    const teamB_Balls_faced = _.sum(_.map(this.teamB.players, 'ballsFaced'));
    schedules[this.scheduleIndex] = {
      ...schedules[this.scheduleIndex],
      'matchResult': this.matchResult,
      teamA: {
        ...schedules[this.scheduleIndex].teamA,
        'scoreCardDet': {
          'overWiseScore': this.teamA.score,
          'playerWiseScore': this.scheduleDet.teamA.players,
          'ballsFaced': teamA_Balls_faced,
          'totalRuns': this.teamA.totalRuns,
          'wickets': this.teamA.wickets,
          'extras': this.teamA.extras,
          'overs': Math.floor(teamA_Balls_faced / 6) + '.' + (teamA_Balls_faced % 6)
        },
      },
      teamB: {
        ...schedules[this.scheduleIndex].teamB,
        'scoreCardDet': {
          'overWiseScore': this.teamB.score,
          'playerWiseScore': this.scheduleDet.teamB.players,
          'totalRuns': this.teamB.totalRuns,
          'ballsFaced': teamB_Balls_faced,
          'wickets': this.teamB.wickets,
          'extras': this.teamB.extras,
          'overs': Math.floor(teamB_Balls_faced / 6) + '.' + (teamB_Balls_faced % 6)
        },
      }
    }
    this.mockService.updatePlayerCarrerDetails({
      teamA: {
        'team_id': schedules[this.scheduleIndex].teamA.team_id,
        'playerWiseScore': schedules[this.scheduleIndex].teamA.scoreCardDet.playerWiseScore
      },
      teamB: {
        'team_id': schedules[this.scheduleIndex].teamB.team_id,
        'playerWiseScore': schedules[this.scheduleIndex].teamB.scoreCardDet.playerWiseScore
      },
      'format': this.scheduleDet?.format
    })
    localStorage.setItem('Schedules', JSON.stringify(schedules));
    this.router.navigate(['/score-details/' + this.scheduleIndex]);
  }
  onTeamSelect(team: any) {
    this.currentBowlingTeam = team === 0 ? 1 : 0;
  }
  saveScore(){
    const savedSchedules = JSON.parse(localStorage.getItem('schedules')||'[]')
    savedSchedules[this.scheduleIndex]=this.scheduleDet;
    localStorage.setItem('schedules', JSON.stringify(savedSchedules));
    this.router.navigate(['/score-details/' + this.scheduleIndex]);
  }
}
