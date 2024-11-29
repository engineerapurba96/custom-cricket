import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-player-details',
  standalone: true,
  imports: [],
  templateUrl: './player-details.component.html',
  styleUrl: './player-details.component.scss'
})
export class PlayerDetailsComponent implements OnInit {
  player: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Retrieve the playerId from the route params
    const playerId = this.route.snapshot.paramMap.get('playerId');

    if (playerId) {
      // Fetch player data based on playerId
      // Assuming you have a service that fetches player data
      this.getPlayerDetails(playerId);
    }
  }
  getPlayerDetails(playerId: string): void {
    // Fetch data for the player (e.g., from localStorage or a service)
    // Here we're assuming the player data is stored in localStorage

    const players = JSON.parse(localStorage.getItem('players') || '[]');
    this.player = players.find((p: any) => p.id === playerId);

    // In case the player isn't found in localStorage, handle that scenario
    if (!this.player) {
      console.error('Player not found!');
    }
  }
}
