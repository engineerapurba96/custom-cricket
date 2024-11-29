import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
declare const bootstrap: any;  // To use Bootstrap's JavaScript functionality in Angular
@Component({
  selector: 'app-players-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './players-list.component.html',
  styleUrl: './players-list.component.scss'
})
export class PlayersListComponent implements OnInit {
  players: any[] = [];  // Array to store players data
  teams: any[] = [];   // Array to store team data
  playerForm!: FormGroup; // Form group for player
  submitted!: boolean;
  constructor(private fb: FormBuilder, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.loadPlayers();
    this.loadTeams();
    this.loadForm();
  }
  // Load teams from localStorage
  loadTeams(): void {
    this.teams = JSON.parse(localStorage.getItem('teams') || '[]');
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
  // Load players from localStorage
  loadPlayers(): void {
    // Fetch players from localStorage
    this.players = JSON.parse(localStorage.getItem('players') || '[]');
  }
  get f() {
    return this.playerForm.controls;
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
