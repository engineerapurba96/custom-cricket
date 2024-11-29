import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
declare const bootstrap: any;

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss',
})
export class TeamsComponent implements OnInit {
  searchText: string = '';
  teams: Array<any> = [];
  newTeams: Array<any> = [];
  isEditMode: boolean = false; // Not used, but kept for potential future extensions
  teamForm!: FormGroup;
  submitted: boolean = false;
  tournamentModal: any;

  constructor(private fb: FormBuilder) {
    // Load teams from localStorage or initialize empty
    const savedTeams = localStorage.getItem('teams');
    this.teams = savedTeams ? JSON.parse(savedTeams) : [];

    // Dummy newTeams data (should be dynamic or fetched from an API)
  }

  ngOnInit(): void {
    this.loadForm();
  }

  get f() {
    return this.teamForm.controls;
  }

  loadForm(): void {
    this.submitted = false;
    this.teamForm = this.fb.group({
      team_name: [null, Validators.required], // Select team by Country_id
      Matches: [0, Validators.required],
      Points: [0, Validators.required],
      Rating: [0, Validators.required],
    });
  }

  searchTeam(): void {
    const searchTextTrimmed = this.searchText.trim().toLowerCase();
    if (searchTextTrimmed) {
      this.teams = this.getTeamsFromLocalStorage().filter((team: any) =>
        team.team_name.toLowerCase().includes(searchTextTrimmed)
      );
    } else {
      this.teams = this.getTeamsFromLocalStorage();
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.teamForm.invalid) {
      return;
    }

    // Create a unique team payload
    const payload = {
      team_name: this.teamForm.value.team_name,
      Matches: this.teamForm.get('Matches')?.value,
      Points: this.teamForm.get('Points')?.value,
      Rating: this.teamForm.get('Rating')?.value,
      no: this.teams.length + 1, // Assign serial number
      team_id: `team_${Date.now()}`, // Generate unique team_id
    };

    // Add the new team to the list
    this.teams.push(payload);

    // Save updated teams to localStorage
    localStorage.setItem('teams', JSON.stringify(this.teams));

    // Close the modal
    document.getElementById('btn-close')?.click();

    // Reset the form for the next entry
    this.loadForm();
  }

  openTeamModal(): void {
    // Filter new teams to exclude already added ones
    this.newTeams = this.newTeams.filter(
      (item1) => !this.teams.some((item2) => item2.team_id === item1.team_id)
    );

    // Open the modal
    this.tournamentModal = new bootstrap.Modal(
      document.getElementById('tournamentModal')!
    );
    this.tournamentModal.show();
  }

  getTeamsFromLocalStorage(): Array<any> {
    const savedTeams = localStorage.getItem('teams');
    return savedTeams ? JSON.parse(savedTeams) : [];
  }
}
