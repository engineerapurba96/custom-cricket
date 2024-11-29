import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../shared/services/mock-data/mock-data.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import _ from 'lodash';

@Component({
  selector: 'app-score-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './score-details.component.html',
  styleUrls: ['./score-details.component.scss'],
})
export class ScoreDetailsComponent {
  cricketScore: any;

  scheduleIndex: any;
  scheduleDet: any;
  _: any = _;

  constructor(private route: ActivatedRoute, private router: Router, private mockService: MockDataService) {
    // this.scheduleIndex = _.last(this.router.url.split("/"));
    // this.scheduleDet = this.mockService.getSchedules()[this.scheduleIndex as any]; // Get the schedule from the mock data
    // if(_.isEmpty(this.scheduleDet)) {
    //   this.router.navigate(['/schedules']);
    // } else if(_.isUndefined(this.scheduleDet?.teamA?.players) || this.scheduleDet?.teamA?.players?.length == 0) {
    //   this.router.navigate(['/match-setup/'+this.scheduleIndex]);
    // } else if(_.isUndefined(this.scheduleDet?.teamA?.scoreCardDet)) {
    //   this.router.navigate(['/score-card/'+this.scheduleIndex]);
    // } 
    this.scheduleIndex = this.route.snapshot.paramMap.get('id');
    const savedSchedules = localStorage.getItem('schedules');
    if (savedSchedules) {
      const scheduleDet = JSON.parse(savedSchedules);  // Load saved schedules from localStorage
      this.scheduleDet = scheduleDet[this.scheduleIndex];
    }
    this.cricketScore = [this.scheduleDet.matchsetup.teamA, this.scheduleDet.matchsetup.teamB];
  }
  yetToBat(players: any){
    return players.filter((player: any) => player.ballsFaced === 0).map((player: any) => player.name);
  }
}
