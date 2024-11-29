import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-points-table',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './points-table.component.html',
  styleUrl: './points-table.component.scss',
})
export class PointsTableComponent {
  searchText: string = '';
  teams = [
    { name: 'KKR', matches: 14, wins: 9, losses: 3, nrr: '+1.428', points: 20 },
    { name: 'SRH', matches: 14, wins: 8, losses: 5, nrr: '+0.414', points: 17 },
    { name: 'RR', matches: 14, wins: 8, losses: 5, nrr: '+0.273', points: 17 },
    { name: 'RCB', matches: 14, wins: 7, losses: 7, nrr: '+0.459', points: 14 },
    { name: 'CSK', matches: 14, wins: 7, losses: 7, nrr: '+0.392', points: 14 },
    { name: 'DC', matches: 14, wins: 7, losses: 7, nrr: '-0.377', points: 14 },
    { name: 'LSG', matches: 14, wins: 7, losses: 7, nrr: '-0.667', points: 14 },
    { name: 'GT', matches: 14, wins: 5, losses: 7, nrr: '-1.063', points: 12 },
    {
      name: 'PBKS',
      matches: 14,
      wins: 5,
      losses: 9,
      nrr: '-0.353',
      points: 10,
    },
    { name: 'MI', matches: 14, wins: 4, losses: 10, nrr: '-0.318', points: 8 },
  ];
  searchTeam() {
    return this.teams.filter(team =>
      team.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

}
