import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import _ from 'lodash';
declare const bootstrap: any;
@Component({
  selector: 'app-tournament-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectComponent,
    RouterModule],
  templateUrl: './tournament-list.component.html',
  styleUrl: './tournament-list.component.scss'
})
export class TournamentListComponent implements OnInit {
  tournamentForm!: FormGroup;
  submitted = false;
  isEditMode = false; // Flag to toggle between create and edit mode
  teams: any[] = [];  // Array to hold teams data
  editData: any = null;  // This will hold the data when editing a tournament
  tournamentModal:any;
  tournaments: any[] = [];  // To store tournaments loaded from localStorage
  constructor(
    private fb: FormBuilder,
  ) {}
  ngOnInit(): void {
    this.loadForm();  // Load the form when the component initializes
    this.loadTeams();  // Load the teams from localStorage or another source
    this.loadTournamentsFromLocalStorage();
  }
  loadTournamentsFromLocalStorage(): void {
    // Retrieve the tournaments from localStorage
    const storedTournaments = localStorage.getItem('tournaments');

    if (storedTournaments) {
      // Parse the JSON string into an object/array
      this.tournaments = JSON.parse(storedTournaments);
    } else {
      // If no tournaments are found, you can initialize an empty array or handle it accordingly
      this.tournaments = [];
    }
  }
  // Load teams from localStorage or a service
  loadTeams(): void {
    const storedTeams = JSON.parse(localStorage.getItem('teams') || '[]');
    this.teams = storedTeams;
  }
  openTournamentModal(tournament?: any): void {
    this.editData = tournament || {};
    if (tournament) {
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
    this.loadForm();
    this.tournamentModal = new bootstrap.Modal(document.getElementById('tournamentModal')!);
    this.tournamentModal.show();
  }
  // Load the form with either new or existing tournament data
  loadForm(): void {
    this.submitted = false;
    this.tournamentForm = this.fb.group({
      name: [this.editData?.name || '', Validators.required],
      startDate: [this.editData?.startDate || null, Validators.required],
      endDate: [this.editData?.endDate || null, Validators.required],
      format: [this.editData?.format || '', Validators.required],
      overs: [this.editData?.overs || '', ...this.editData?.format === 'Custom' ? [Validators.required] : []],
      host: [this.editData?.hostId || '', Validators.required],
      participants: [this.editData?.participants || [], Validators.required],
      hostName: [this.editData?.hostName || '']
    });

    this.tournamentForm.get('format')?.valueChanges.subscribe((format: any) => {
      this.tournamentForm.get('overs')?.setValue("");
      if (format == 'Custom') {
        this.tournamentForm.get('overs')?.setValidators([]);
      } else {
        this.tournamentForm.get('overs')?.setValidators([Validators.required]);
      }
      this.tournamentForm.get('overs')?.updateValueAndValidity();
    });
  }
  get f() {
    return this.tournamentForm.controls;
  }
  // Handle form submission (create or edit tournament)
  onSubmit(): void {
    this.submitted = true;
    if (this.tournamentForm.invalid) {
      return;
    }
    const tournamentData = this.tournamentForm.value;
    console.log(tournamentData);
    if (this.isEditMode) {
      // Update the existing tournament
      this.updateTournament(tournamentData);
    } else {
      // Create a new tournament
      this.createTournament(tournamentData);
    }
    document.getElementById("btn-close")?.click();
  }

  // Reset the form after submission
  resetForm(): void {
    this.isEditMode = false;
    this.editData = null;
    this.loadForm();  // Reinitialize the form
  }

  // Create new tournament
  createTournament(tournamentData: any): void {
    const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    tournamentData.id = (tournaments.length + 1).toString();  // Generate new ID
    tournaments.push(tournamentData);
    localStorage.setItem('tournaments', JSON.stringify(tournaments));  // Save to localStorage
    this.resetForm();  // Reset the form
  }

  // Update existing tournament
  updateTournament(tournamentData: any): void {
    const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    const index = tournaments.findIndex((t: any) => t.id === this.editData.id);
    if (index !== -1) {
      tournaments[index] = { ...tournaments[index], ...tournamentData };
      localStorage.setItem('tournaments', JSON.stringify(tournaments));  // Save updated tournament
    }
    this.resetForm();  // Reset the form
  }

  onFormatChange(event: any) {
    const selectedFormat = event.target.value;
    console.log("Selected format:", selectedFormat);
  
    const oversControl = this.tournamentForm.get('overs');
    if (oversControl !== null && oversControl !== undefined) {  // Explicit null check
      if (selectedFormat == 'T20') {
        oversControl.setValue(20);
      } else if (selectedFormat == 'ODI') {
        oversControl.setValue(50);
      } else if (selectedFormat == 'Test') {
        oversControl.setValue(10);
      }
    }
  }
  
}
