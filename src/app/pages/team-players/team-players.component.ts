import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
declare const bootstrap: any;  // To use Bootstrap's JavaScript functionality in Angular
@Component({
  selector: 'app-team-players',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './team-players.component.html',
  styleUrl: './team-players.component.scss'
})
export class TeamPlayersComponent implements OnInit{
  teams: any;
  players: any = [];
  playerForm!: FormGroup; // Form group for player
  submitted!: boolean;
  teamId: any;
  selectedTeam: any;
  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    // Fetch data from localStorage
    this.teams = JSON.parse(localStorage.getItem('teams') || '[]');
    this.loadForm();
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // Get teamId from route
      this.teamId = params['teamId'];  // Assuming your route is something like '/team/:teamId'
      this.loadPlayersByTeamId();  // Load players filtered by teamId
      this.loadTeamData();
    });
  }
  // Load players and filter by teamId
  loadPlayersByTeamId() {
    const players = JSON.parse(localStorage.getItem('players') || '[]'); // Get players from localStorage
    this.players = players.filter((player: any) => player.team.team_id === this.teamId); // Filter by team_id
  }

  get f() {
    return this.playerForm.controls;
  }

  loadTeamData(): void {
    // Fetch the team based on the teamId from localStorage
    this.selectedTeam = this.teams.find((team: any) => team.team_id === this.teamId);

    if (this.selectedTeam) {
      // If team found, populate the form with team data
      this.playerForm.patchValue({
        team: this.selectedTeam, // Set the teamId to the form control
        name: '',  // Reset the player name field
      });
    }
  }
  loadForm(): void {
    this.submitted = false;
    this.playerForm = this.fb.group({
      name: [null, Validators.required], // Select team by Country_id
      team: [null, Validators.required], // Team selection field
      points: [null, Validators.required],
      careerBattingBest: [null, Validators.required],
      // Batting statistics
      numMatchesBatting: [0, Validators.required],
      num6s: [0, Validators.required],
      num4s: [0, Validators.required],
      // Bowling statistics
      numMatchesBowling: [0, Validators.required],
      numWickets: [0, Validators.required],
      num4sBowled: [0, Validators.required],
      num6sBowled: [0, Validators.required],
    });
  }
  // Open the player modal
  openPlayerModal(): void {
    const playerModal = new bootstrap.Modal(document.getElementById('playerModal')!);
    playerModal.show();
  }
  // Handle form submission
  onSubmitPlayer(): void {
    this.submitted = true;

    if (this.playerForm.invalid) {
      return;
    }
    if (this.playerForm.valid) {
      const newPlayer = {
        id: `player_${Date.now()}`,  // Unique ID for the player
        name: this.playerForm.get('name')?.value,
        team: this.playerForm.get('team')?.value,
        points: this.playerForm.get('points')?.value,
        careerBattingBest: this.playerForm.get('points')?.value,
        // Batting statistics
        numMatchesBatting: this.playerForm.get('numMatchesBatting')?.value,
        num6s: this.playerForm.get('num6s')?.value,
        num4s: this.playerForm.get('num4s')?.value,
        // Bowling statistics
        numMatchesBowling: this.playerForm.get('numMatchesBowling')?.value,
        numWickets: this.playerForm.get('numWickets')?.value,
        num4sBowled: this.playerForm.get('num4sBowled')?.value,
        num6sBowled: this.playerForm.get('num6sBowled')?.value,
        ballsFaced: 0,
      };

      // Store player to localStorage or handle as required
      let players = JSON.parse(localStorage.getItem('players') || '[]');
      players.push(newPlayer);
      localStorage.setItem('players', JSON.stringify(players));

      // Close the modal
      const playerModal = bootstrap.Modal.getInstance(document.getElementById('playerModal')!);
      playerModal.hide();

      // Reset the form
      this.playerForm.reset();
      this.players = JSON.parse(localStorage.getItem('players') || '[]');
    }
  }
}
