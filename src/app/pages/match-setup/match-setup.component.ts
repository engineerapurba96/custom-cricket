import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { MockDataService } from '../../shared/services/mock-data/mock-data.service';
import _, { over } from 'lodash';

@Component({
  selector: 'app-match-setup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NgSelectModule],
  templateUrl: './match-setup.component.html',
  styleUrl: './match-setup.component.scss',
})
export class MatchSetupComponent implements OnInit{

  teamDetailsForm: any = {};
  playerDetails: any = {
    teamA: [],
    teamB: [],
    selectedTeamA_players: [],
    selectedTeamB_players: []
  }
  teamA: any = [];
  teamB: any = [];
  scheduleDet: any = {};
  submitted: boolean = false;
  scheduleIndex: any = null;
  _: any = _;

  constructor(private route: ActivatedRoute, private router: Router, private mockService: MockDataService, private fb: FormBuilder) {
    this.scheduleIndex = this.route.snapshot.paramMap.get('id');
    const savedSchedules = localStorage.getItem('schedules');
    if (savedSchedules) {
      const scheduleDet = JSON.parse(savedSchedules);  // Load saved schedules from localStorage
      this.scheduleDet = scheduleDet[this.scheduleIndex];
    }
    if (_.isEmpty(this.scheduleDet)) {
      this.router.navigate(['/schedules']);
    }
    this.loadForm();
  }
  ngOnInit(): void {
    this.loadTeamAPlayers();
    this.loadTeamBPlayers();
  }

  loadTeamAPlayers() {
    if (this.scheduleDet && this.scheduleDet.teamA && this.scheduleDet.teamA.team_id) {
      const players = JSON.parse(localStorage.getItem('players') || '[]');
      const filteredPlayers = players.filter((player: any) => player.team.team_id === this.scheduleDet.teamA.team_id);
      this.teamA = filteredPlayers;
      console.log("Team A Players:", this.teamA);
    } else {
      console.log("Team A or schedule details not found");
    }
  }

  loadTeamBPlayers() {
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const filteredPlayers = players.filter((player: any) => player.team.team_id === this.scheduleDet.teamB.team_id);
    this.teamB = filteredPlayers;
    console.log("Team B Players:", this.teamB);
  }

  loadForm() {
    this.submitted = false;
    this.teamDetailsForm = this.fb.group({
      overs: [this.scheduleDet?.overs || "", Validators.required],
      teamA: this.fb.group({
        players: [null, Validators.required],
        wicketKeeper: ["", Validators.required],
        captain: ["", Validators.required]
      }),
      teamB: this.fb.group({
        players: [null, Validators.required],
        wicketKeeper: ['', Validators.required],
        captain: ["", Validators.required]
      })
    });
    if (_.isEmpty(this.teamAf.players.value)) {
      this.teamAf.players.setValue(_.map(this.playerDetails.teamA, 'Player_id'));
    }
    if (_.isEmpty(this.teamBf.players.value)) {
      this.teamBf.players.setValue(_.map(this.playerDetails.teamB, 'Player_id'));
    }
    this.teamAf.players.valueChanges.subscribe((players: any) => {
      if (this.teamAf.wicketKeeper.value && !players.includes(this.teamAf.wicketKeeper.value)) {
        this.teamAf.wicketKeeper.setValue("");
      }
      if (this.teamAf.captain.value && !players.includes(this.teamAf.captain.value)) {
        this.teamAf.captain.setValue("");
      }
    });
    this.teamBf.players.valueChanges.subscribe((players: any) => {
      if (this.teamBf.wicketKeeper.value && !players.includes(this.teamBf.wicketKeeper.value)) {
        this.teamBf.wicketKeeper.setValue("");
      }
      if (this.teamBf.captain.value && !players.includes(this.teamBf.captain.value)) {
        this.teamBf.captain.setValue("");
      }
    });
  }

  get f() { return this.teamDetailsForm.controls; }

  get teamAf() { return this.teamDetailsForm.controls.teamA.controls; }

  get teamBf() { return this.teamDetailsForm.controls.teamB.controls; }

  selectAll(team: string) {
    if (team === 'teamA') {
      if (this.teamA.length == this.teamAf.players.value.length)
        this.teamAf.players.setValue([]);
      else
        this.teamAf.players.setValue(_.map(this.playerDetails.teamA, 'id'));
    } else {
      if (this.teamB.length == this.teamBf.players.value.length)
        this.teamBf.players.setValue([]);
      else
        this.teamBf.players.setValue(_.map(this.playerDetails.teamB, 'id'));
    }
  }

  unselectAll(team: string) {
    if (team === 'teamA') {
      this.teamAf.players.setValue([]);
    } else {
      this.teamBf.players.setValue([]);
    }
  }

  saveMatchDetails() {
    this.submitted = true;
    if (this.teamDetailsForm.invalid) return;
    if (this.teamAf.players.value.length != this.teamBf.players.value.length) {
      alert(`${this.scheduleDet.teamA.team_name} has ${this.teamAf.players.value.length} players and ${this.scheduleDet.teamB.team_name} has ${this.teamBf.players.value.length} players. Please select equal number of players for both the teams.`);
      return;
    }
    let sch = JSON.parse(localStorage.getItem('schedules')||'[]');
    sch[this.scheduleIndex].matchsetup = this.teamDetailsForm.value;
    localStorage.setItem('schedules', JSON.stringify(sch));
    this.router.navigate(['/score-card/' + this.scheduleIndex]);
  }

}
