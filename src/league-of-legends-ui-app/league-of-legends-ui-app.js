import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import {} from '@polymer/polymer/lib/elements/dom-if.js';
import 'api-nav/api-nav.js';
import 'reddit-ui/reddit-ui.js';
import 'twitch-ui/twitch-ui.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-tabs/paper-tabs.js';

/**
 * @customElement
 * @polymer
 */
class LeagueOfLegendsUiApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        paper-radio-group, paper-input, paper-button {
          width: 100%;
          text-align: center;
          padding: 15px 0px 15px 0px;
          margin-left: 0;
          margin-right: 0;
        }

        paper-item {
          justify-content: center;
        }
        
        paper-tabs {
          color: var(--paper-blue-900);
          --paper-tabs-selection-bar-color: var(--paper-blue-900);
          --paper-tab-ink: var(--paper-blue-900);
        }
        
        paper-button.custom:hover {
          background-color: var(--paper-light-blue-50);
        }

        .custom-hover:hover {
          background-color: var(--paper-light-blue-50);
        }
        
        paper-spinner {
          padding: 0;
          max-width: 0;
          max-height: 0;
        }
        
        paper-spinner.active {
          max-width: initial;
          max-height: initial;
          height: 15px;
          width: 15px;
          margin: 0px 0px 0px -15px
        }

        paper-card {
          width: 100%;
        }

        paper-dialog {
          text-align: center;
        }

        #chartscrollable {
          height: 206px;
        }

        .chartclass {
          padding: 0;
          margin: 0;
        }
        
        .flex-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          background: #edeef0;
        }

        .bg-container {
          background: #edeef0;
        }

        .twitch-col {
          flex: 1;
          order 3;
          padding: 0 15px 0 15px;
        }

        .search-col {
          flex: 1;
          order: 1;
        }

        .reddit-col {
          flex: 1;
          order: 2;
          padding: 0 15px 0 15px;
        }

        .display-none {
          display: none;
        }

        api-nav {
          padding: 15px;
        }
        
        @media (max-width: 480px) {
          #chart {
            width: 400px;
            left: -40px;
          }

          .flex-container {
            display: flex;
            flex-direction: row;
          }

          .twitch-col {
            display: flex;
            flex-direction: row;
            order: 2;
            flex-grow: unset;
            flex-shrink: unset;
            flex-basis:unset;
            padding: 0 5px 0 5px;
          }

          .search-col {
            display: flex;
            flex-direction: column;
            order: 1;
            flex-grow: unset;
            flex-shrink: unset;
            flex-basis:unset;
            width: 100%;
            align-items: center;
            padding: 0 5px 0 5px;
          }

          .reddit-col {
            display: flex;
            flex-direction: row;
            order: 3;
            flex-grow: unset;
            flex-shrink: unset;
            flex-basis:unset;
            padding: 0;
            padding: 0 5px 0 5px;
          }
        }
      </style>
      <div class="bg-container">
        <api-nav></api-nav>
      </div>
      <paper-dialog id="chart">
        <h2>[[charttitle]]</h2>
        <paper-dialog-scrollable class="chartclass">
          <div id="chartscrollable"></div>
        </paper-dialog-scrollable>
        <div class="buttons">
          <paper-button dialog-dismiss class="custom-hover">Cancel</paper-button>
        </div>
      </paper-dialog>
      <div class="flex-container">
        <div class="twitch-col">
          <twitch-ui gamename="league of legends"></twitch-ui>
        </div>
        <div class="search-col">
          <paper-card>
            <paper-item>Platform</paper-item>
            <paper-radio-group id="region" label="Region" selected="na">
              <paper-radio-button name="na">NA</paper-radio-button>
              <paper-radio-button name="kr">KR</paper-radio-button>
              <paper-radio-button name="br1">BR</paper-radio-button>
              <paper-radio-button name="eun1">EUNE</paper-radio-button>
              <paper-radio-button name="euw1">EUW</paper-radio-button>
              <paper-radio-button name="jp1">JP</paper-radio-button>
              <paper-radio-button name="la1">LAN</paper-radio-button>
              <paper-radio-button name="la2">LAS</paper-radio-button>
              <paper-radio-button name="oc1">OCE</paper-radio-button>
              <paper-radio-button name="tr1">TR</paper-radio-button>
              <paper-radio-button name="ru">RU</paper-radio-button>
              <paper-radio-button name="pbe1">PBE</paper-radio-button>
            </paper-radio-group>
            <paper-input 
              always-float-label
              label="Summoner Name"
              id="summonerName"
              required
              auto-validate
              error-message="Summoner Name is required"
              on-keydown="_checkForEnter"></paper-input>
            <paper-button toggles raised class="custom" on-tap="_invokeApi"><paper-spinner id="spinner" active=[[active]]></paper-spinner>Get Stats</paper-button>
            <div id="tabsDiv">
              <div class="filter display-none">
                <paper-tabs id="paperTabs">
                  <paper-tab id="tabZero" on-tap="_displayStats">Statistics</paper-tab>
                  <paper-tab on-tap="_displayRecentMatches">Recent Matches</paper-tab>
                </paper-tabs>
              </div>
            </paper-card>
          </div>
          <div id="searchResults">
            <div class="filter display-none">
              <paper-item>Summoner Name: [[name]]</paper-item>
              <paper-item>Summoner Level: [[summonerlevel]]</paper-item>
              <paper-item>League Name: [[leaguename]]</paper-item>
              <paper-item>Tier: [[tier]]</paper-item>
              <paper-item>League Points: [[leaguepoints]]</paper-item>
              <paper-item>Wins: [[wins]]</paper-item>
              <paper-item>Losses: [[losses]]</paper-item>
            </div>
          </div>
          <div id="recentMatches">
            <div class="filter display-none">
              <paper-item>Summoner Name: [[name]]</paper-item>
              <template is="dom-repeat" items="[[recentMatchesRepeat]]">
                <template is="dom-if" if="[[item.gameId]]">
                  <paper-item>Game ID: [[item.gameId]]</paper-item>
                </template>
                <template is="dom-if" if="[[item.championName]]">
                  <paper-item>Champion: [[item.championName]]</paper-item>
                </template>
                <template is="dom-if" if="[[item.lane]]">
                  <paper-item>Lane: [[item.lane]]</paper-item>
                </template>
                <template is="dom-if" if="[[item.role]]">
                  <paper-item>Role: [[item.role]]</paper-item>
                </template>
                <template is="dom-if" if="[[item.result]]">
                  <paper-item>Result: [[item.result]]</paper-item>
                </template>
                <template is="dom-if" if="[[item.season]]">
                  <paper-item>Season: [[item.season]]</paper-item>
                </template>
                <template is="dom-if" if="[[item.timestamp]]">
                  <paper-item>Timestamp: [[item.timestamp]]</paper-item>
                </template>
                <template is="dom-if" if="[[item.gameId]]">
                  <paper-button toggles raised class="custom" on-tap="_invokeApiMatchStats" data-item$="[[item]]">Match Stats</paper-button>
                </template>
                <hr/>
              </template>
            </div>
          </div>
          <div id="playerNotFound">
            <div class="filter display-none">
              <paper-item>Player Not found!</paper-item>
            </div>
          </div>
          <div id="generalError">
            <div class="filter display-none">
              <paper-item>Error processing request.</paper-item>
            </div>
          </div>
        </div>
        <div class="reddit-col">
          <reddit-ui game="leagueoflegends" displayname="League of Legends"></reddit-ui>
        </div>
        <paper-dialog id="dialog">
          <paper-spinner id="dialogSpinner" active=[[active]]></paper-spinner>
          <h2>Match Stats</h2>
          <p>Click on a stat for a graph</p>
          <paper-dialog-scrollable>
            <paper-item class="custom-hover">Victory: [[win]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="champLevel|Champion Level|Level|number">Champion Level: [[champLevel]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="kills|Kills|Kills|number">Kills: [[kills]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="deaths|Deaths|Deaths|number">Deaths: [[deaths]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="assists|Assists|Assists|number">Assists: [[assists]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="goldEarned|Gold Earned|Gold Earned|number">Gold Earned: [[goldEarned]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="goldSpent|Gold Spent|Gold Spent|number">Gold Spent: [[goldSpent]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="visionScore|Vision Score|Vision Score|number">Vision Score: [[visionScore]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="doubleKills|Double Kills|Double Kills|number">Double Kills: [[doubleKills]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="tripleKills|Triple Kills|Triple Kills|number">Triple Kills: [[tripleKills]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="quadraKills|Quadra Kills|Quadra Kills|number">Quadra Kills: [[quadraKills]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="pentaKills|Penta Kills|Penta Kills|number">Penta Kills: [[pentaKills]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="inhibitorKills|Inhibitor Kills|Inhibitor Kills|number">Inhibitor Kills: [[inhibitorKills]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="killingSprees|Killing Sprees|Killing Sprees|number">Killing Sprees: [[killingSprees]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="largestKillingSpree|Largest Killing Spree|Largest Killing Spree|number">Largest Killing Spree: [[largestKillingSpree]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="largestMultiKill|Largest Multi Kill|Largest Multi Kill|number">Largest Multi Kill: [[largestMultiKill]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="totalMinionsKilled|Total Minions Killed|Total Minions Killed|number">Total Minions Killed: [[totalMinionsKilled]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="turretKills|Turret Kills|Turret Kills|number">Turret Kills: [[turretKills]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="unrealKills|Unreal Kills|Unreal Kills|number">Unreal Kills: [[unrealKills]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="wardsKilled|Wards Killed|Wards Killed|number">Wards Killed: [[wardsKilled]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="damageDealtToObjectives|Damage Dealt To Objectives|Damage Dealt To Objectives|number">Damage Dealt To Objectives: [[damageDealtToObjectives]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="damageDealtToTurrets|Damage Dealt To Turrets|Damage Dealt To Turrets|number">Damage Dealt To Turrets: [[damageDealtToTurrets]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="damageSelfMitigated|Damage Self Mitigated|Damage Self Mitigated|number">Damage Self Mitigated: [[damageSelfMitigated]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="magicDamageDealt|Magic Damage Dealt|Magic Damage Dealt|number">Magic Damage Dealt: [[magicDamageDealt]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="magicDamageDealtToChampions|Magic Damage Dealt To Champions|Magic Damage Dealt To Champions|number">Magic Damage Dealt To Champions: [[magicDamageDealtToChampions]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="magicalDamageTaken|Magical Damage Taken|Magical Damage Taken|number">Magical Damage Taken: [[magicalDamageTaken]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="physicalDamageDealt|Physical Damage Dealt|Physical Damage Dealt|number">Physical Damage Dealt: [[physicalDamageDealt]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="physicalDamageDealtToChampions|Physical Damage Dealt To Champions|Physical Damage Dealt To Champions|number">Physical Damage Dealt To Champions: [[physicalDamageDealtToChampions]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="physicalDamageTaken|Physical Damage Taken|Physical Damage Taken|number">Physical Damage Taken: [[physicalDamageTaken]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="totalDamageDealt|Total Damage Dealt|Total Damage Dealt|number">Total Damage Dealt: [[totalDamageDealt]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="totalDamageDealtToChampions|Total Damage Dealt To Champions|Total Damage Dealt To Champions|number">Total Damage Dealt To Champions: [[totalDamageDealtToChampions]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="trueDamageDealt|True Damage Dealt|True Damage Dealt|number">True Damage Dealt: [[trueDamageDealt]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="trueDamageDealtToChampions|True Damage Dealt To Champions|True Damage Dealt To Champions|number">True Damage Dealt To Champions: [[trueDamageDealtToChampions]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="trueDamageTaken|True Damage Taken|True Damage Taken|number">True Damage Taken: [[trueDamageTaken]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="totalDamageTaken|Total Damage Taken|Total Damage Taken|number">Total Damage Taken: [[totalDamageTaken]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="totalHeal|Total Heal|Total Heal|number">Total Heal: [[totalHeal]]</paper-item>
            <paper-item class="custom-hover">First Blood Assist: [[firstBloodAssist]]</paper-item>
            <paper-item class="custom-hover">First Blood Kill: [[firstBloodKill]]</paper-item>
            <paper-item class="custom-hover">First Inhibitor Assist: [[firstInhibitorAssist]]</paper-item>
            <paper-item class="custom-hover">First Inhibitor Kill: [[firstInhibitorKill]]</paper-item>
            <paper-item class="custom-hover">First Tower Assist: [[firstTowerAssist]]</paper-item>
            <paper-item class="custom-hover">First Tower Kill: [[firstTowerKill]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="largestCriticalStrike|Largest Critical Strike|Largest Critical Strike|number">Largest Critical Strike: [[largestCriticalStrike]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="longestTimeSpentLiving|Longest Time Spent Living|Longest Time Spent Living|number">Longest Time Spent Living: [[longestTimeSpentLiving]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="neutralMinionsKilled|Neutral Minions Killed|Neutral Minions Killed|number">Neutral Minions Killed: [[neutralMinionsKilled]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="neutralMinionsKilledEnemyJungle|Neutral Minions Killed Enemy Jungle|Neutral Minions Killed Enemy Jungle|number">Neutral Minions Killed Enemy Jungle: [[neutralMinionsKilledEnemyJungle]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="neutralMinionsKilledTeamJungle|Neutral Minions Killed Team Jungle|Neutral Minions Killed Team Jungle|number">Neutral Minions Killed Team Jungle: [[neutralMinionsKilledTeamJungle]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="sightWardsBoughtInGame|Sight Wards Bought In Game|Sight Wards Bought In Game|number">Sight Wards Bought In Game: [[sightWardsBoughtInGame]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="timeCCingOthers|Time CC'ing Others|Time CC'ing Others|number">Time CC'ing Others: [[timeCCingOthers]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="totalTimeCrowdControlDealt|Total Time Crowd Control Dealt|Total Time Crowd Control Dealt|number">Total Time Crowd Control Dealt: [[totalTimeCrowdControlDealt]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="totalUnitsHealed|Total Units Healed|Assists|Total Units Healed">Total Units Healed: [[totalUnitsHealed]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="visionWardsBoughtInGame|Vision Wards Bought In Game|Vision Wards Bought In Game|number">Vision Wards Bought In Game: [[visionWardsBoughtInGame]]</paper-item>
            <paper-item class="custom-hover" on-tap="_showChart" data-item$="wardsPlaced|Wards Placed|Wards Placed|number">Wards Placed: [[wardsPlaced]]</paper-item>
          </paper-dialog-scrollable>
          <div class="buttons">
            <paper-button dialog-dismiss class="custom-hover">Cancel</paper-button>
          </div>
        </paper-dialog>
      </div>
    `;
  }
  static get properties() {
    return {
      active: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      name: {
        type: String
      },
      summonerLevel: {
        type: String
      },
      leaguename: {
        type: String
      },
      tier: {
        type: String
      },
      leaguepoints: {
        type: String
      },
      wins: {
        type: String
      },
      losses: {
        type: String
      },
      recentMatchesRepeat: {
        type: Array
      },
      win: {
        type: String
      },
      champLevel: {
        type: String
      },
      kills: {
        type: String
      },
      deaths: {
        type: String
      },
      assists: {
        type: String
      },
      goldEarned: {
        type: String
      },
      goldSpent: {
        type: String
      },
      visionScore: {
        type: String
      },
      doubleKills: {
        type: String
      },
      tripleKills: {
        type: String
      },
      quadraKills: {
        type: String
      },
      pentaKills: {
        type: String
      },
      inhibitorKills: {
        type: String
      },
      killingSprees: {
        type: String
      },
      largestKillingSpree: {
        type: String
      },
      largestMultiKill: {
        type: String
      },
      totalMinionsKilled: {
        type: String
      },
      turretKills: {
        type: String
      },
      unrealKills: {
        type: String
      },
      wardsKilled: {
        type: String
      },
      damageDealtToObjectives: {
        type: String
      },
      damageDealtToTurrets: {
        type: String
      },
      damageSelfMitigated: {
        type: String
      },
      magicDamageDealt: {
        type: String
      },
      magicDamageDealtToChampions: {
        type: String
      },
      magicalDamageTaken: {
        type: String
      },
      physicalDamageDealt: {
        type: String
      },
      physicalDamageDealtToChampions: {
        type: String
      },
      physicalDamageTaken: {
        type: String
      },
      totalDamageDealt: {
        type: String
      },
      totalDamageDealtToChampions: {
        type: String
      },
      trueDamageDealt: {
        type: String
      },
      trueDamageDealtToChampions: {
        type: String
      },
      trueDamageTaken: {
        type: String
      },
      totalDamageTaken: {
        type: String
      },
      totalHeal: {
        type: String
      },
      firstBloodAssist: {
        type: String
      },
      firstBloodKill: {
        type: String
      },
      firstInhibitorAssist: {
        type: String
      },
      firstInhibitorKill: {
        type: String
      },
      firstTowerAssist: {
        type: String
      },
      firstTowerKill: {
        type: String
      },
      largestCriticalStrike: {
        type: String
      },
      longestTimeSpentLiving: {
        type: String
      },
      neutralMinionsKilled: {
        type: String
      },
      neutralMinionsKilledEnemyJungle: {
        type: String
      },
      neutralMinionsKilledTeamJungle: {
        type: String
      },
      sightWardsBoughtInGame: {
        type: String
      },
      timeCCingOthers: {
        type: String
      },
      totalTimeCrowdControlDealt: {
        type: String
      },
      totalUnitsHealed: {
        type: String
      },
      visionWardsBoughtInGame: {
        type: String
      },
      wardsPlaced: {
        type: String
      },
      participantId: {
        type: Number
      },
      chartShown: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      participants:{
        type: Array
      },
      participantIdentities:{
        type: Array
      },
      charttitle: {
        type: String
      }
    };
  }

  _showChart(event){
    let item = event.target.dataset.item$;
    this.toggleCharts(item);
  }

  toggleDialog() {
    this.$.dialog.toggle();
  }

  toggleCharts(item){
    this.drawMultSeries(item);
    this.$.chart.toggle();
  }

  drawMultSeries(item) {
    let values = item.split('|');
    let chartArray = [];
    chartArray.push(['', '', { role: 'style' } ]);
    for(var i = 0; i < this.participants.length; i++){
      let stat = this.participants[i].stats[values[0]];
      let partId = this.participants[i].participantId;
      let playerName = '';
      let searchedPlayer = false;
      for(var j = 0; j < this.participantIdentities.length; j++){
        if(partId === this.participantIdentities[j].participantId){
          playerName = this.participantIdentities[j].player.summonerName;
          if(this.participantId === this.participantIdentities[j].participantId){
            searchedPlayer = true;
          }
          break;
        }
      }
      chartArray.push([playerName, stat, searchedPlayer ? 'color: blue' : 'color: lightblue']);
    }
    this.charttitle = values[1];
    var data = google.visualization.arrayToDataTable(chartArray);
    var options = {
      chartArea: {width: '50%'},
      colors: ['', ''],
      hAxis: {
        title: values[2],
        minValue: 0
      }
    };
    var chart = new google.visualization.BarChart(this.$.chartscrollable);
    chart.draw(data, options);
  }

  _invokeApiMatchStats(event) {
    this.toggleDialog();
    this.$.dialogSpinner.active = true;
    this.$.dialogSpinner.classList.add('active');
    let item = event.target.dataset.item;
    item = JSON.parse(item);
    var url = 'https://xupmhdl2g5.execute-api.us-east-1.amazonaws.com/api/league-of-legends-match-api?region=' + item.platformId.toLowerCase() + '&gameId=' + item.gameId;
    let err = false;

    fetch(url, {
      method: 'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => {
      console.error('Error:', error);
      err = true;
      this.$.dialogSpinner.active = false;
      this.$.dialogSpinner.classList.remove('active');
    })
    .then(response => {
      if(err){
        return;
      }
      response = JSON.parse(response);
      this.$.dialogSpinner.active = false;
      this.$.dialogSpinner.classList.remove('active');
      let participantId = 0;
      for(var i = 0; i < response.participantIdentities.length; i++){
        if(response.participantIdentities[i].player.summonerName.toLowerCase() === this.name.toLowerCase()){
          participantId = response.participantIdentities[i].participantId;
          this.participantId = participantId;
          break;
        }
      }
      this.participants = response.participants;
      this.participantIdentities = response.participantIdentities;
      for(var j = 0; j < response.participants.length; j++){
        if(response.participants[j].participantId === participantId){
          this.win = response.participants[j].stats.win;
          this.champLevel = response.participants[j].stats.champLevel;
          this.kills = response.participants[j].stats.kills;
          this.deaths = response.participants[j].stats.deaths;
          this.assists = response.participants[j].stats.assists;
          this.goldEarned = response.participants[j].stats.goldEarned;
          this.goldSpent = response.participants[j].stats.goldSpent;
          this.visionScore = response.participants[j].stats.visionScore;
          this.doubleKills = response.participants[j].stats.doubleKills;
          this.tripleKills = response.participants[j].stats.tripleKills;
          this.quadraKills = response.participants[j].stats.quadraKills;
          this.pentaKills = response.participants[j].stats.pentaKills;
          this.inhibitorKills = response.participants[j].stats.inhibitorKills;
          this.killingSprees = response.participants[j].stats.killingSprees;
          this.totalMinionsKilled = response.participants[j].stats.totalMinionsKilled;
          this.turretKills = response.participants[j].stats.turretKills;
          this.unrealKills = response.participants[j].stats.unrealKills;
          this.wardsKilled = response.participants[j].stats.wardsKilled;
          this.damageDealtToObjectives = response.participants[j].stats.damageDealtToObjectives;
          this.damageDealtToTurrets = response.participants[j].stats.damageDealtToTurrets;
          this.damageSelfMitigated = response.participants[j].stats.damageSelfMitigated;
          this.magicDamageDealt = response.participants[j].stats.magicDamageDealt;
          this.magicDamageDealtToChampions = response.participants[j].stats.magicDamageDealtToChampions;
          this.magicalDamageTaken = response.participants[j].stats.magicalDamageTaken;
          this.physicalDamageDealt = response.participants[j].stats.physicalDamageDealt;
          this.physicalDamageDealtToChampions = response.participants[j].stats.physicalDamageDealtToChampions;
          this.physicalDamageTaken = response.participants[j].stats.physicalDamageTaken;
          this.totalDamageDealt = response.participants[j].stats.totalDamageDealt;
          this.totalDamageDealtToChampions = response.participants[j].stats.totalDamageDealtToChampions;
          this.trueDamageDealt = response.participants[j].stats.trueDamageDealt;
          this.trueDamageDealtToChampions = response.participants[j].stats.trueDamageDealtToChampions;
          this.trueDamageTaken = response.participants[j].stats.trueDamageTaken;
          this.totalDamageTaken = response.participants[j].stats.totalDamageTaken;
          this.totalHeal = response.participants[j].stats.totalHeal;
          this.firstBloodAssist = response.participants[j].stats.firstBloodAssist;
          this.firstBloodKill = response.participants[j].stats.firstBloodKill;
          this.firstInhibitorAssist = response.participants[j].stats.firstInhibitorAssist;
          this.firstInhibitorKill = response.participants[j].stats.firstInhibitorKill;
          this.firstTowerAssist = response.participants[j].stats.firstTowerAssist;
          this.firstTowerKill = response.participants[j].stats.firstTowerKill;
          this.largestCriticalStrike = response.participants[j].stats.largestCriticalStrike;
          this.largestKillingSpree = response.participants[j].stats.largestKillingSpree;
          this.largestMultiKill = response.participants[j].stats.largestMultiKill;
          this.longestTimeSpentLiving = response.participants[j].stats.longestTimeSpentLiving;
          this.neutralMinionsKilled = response.participants[j].stats.neutralMinionsKilled;
          this.neutralMinionsKilledEnemyJungle = response.participants[j].stats.neutralMinionsKilledEnemyJungle;
          this.neutralMinionsKilledTeamJungle = response.participants[j].stats.neutralMinionsKilledTeamJungle;
          this.sightWardsBoughtInGame = response.participants[j].stats.sightWardsBoughtInGame;
          this.timeCCingOthers = response.participants[j].stats.timeCCingOthers;
          this.totalTimeCrowdControlDealt = response.participants[j].stats.totalTimeCrowdControlDealt;
          this.totalUnitsHealed = response.participants[j].stats.totalUnitsHealed;
          this.visionWardsBoughtInGame = response.participants[j].stats.visionWardsBoughtInGame;
          this.wardsPlaced = response.participants[j].stats.wardsPlaced;    
        }
      }
    });
  }

  _invokeApi() {
    this.$.spinner.active = true;
    this._hideElement(this.$.tabsDiv);
    this._hideElement(this.$.searchResults);
    this._hideElement(this.$.recentMatches);
    this.$.spinner.classList.add('active');
    const summonerNameValidate = this.$.summonerName.validate();
    if(summonerNameValidate){
      var url = 'https://xupmhdl2g5.execute-api.us-east-1.amazonaws.com/api/league-of-legends-api?region=' + this.$.region.selected + '&summonerName=' + this.$.summonerName.value;
      let err = false;

      fetch(url, {
        method: 'GET',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .catch(error => {
        this.$.spinner.active = false;
        this.$.spinner.classList.remove('active');
        console.error('Error:', error);
        this._hideElement(this.$.playerNotFound);
        this._hideElement(this.$.tabsDiv);
        this._hideElement(this.$.searchResults);
        this._hideElement(this.$.recentMatches);
        this._showElement(this.$.generalError);
        err = true;
      })
      .then(response => {
        if(err){
          return;
        }
        this._hideElement(this.$.generalError);
        this.$.spinner.active = false;
        this.$.spinner.classList.remove('active');
        if(response.message
              && response.message.indexOf('Player not found in region: ') !== -1){
            this._showElement(this.$.playerNotFound);
            this._hideElement(this.$.tabsDiv);
            this._hideElement(this.$.searchResults);
            this._hideElement(this.$.recentMatches);
        } else {
          this._hideElement(this.$.playerNotFound);
          this._showElement(this.$.tabsDiv);
          this._showElement(this.$.searchResults);
          this.$.paperTabs._tabChanged(this.$.tabZero, null);
          this.$.tabZero.setAttribute("focused", "");
          this.name = response.account.name;
          this.summonerlevel = response.account.summonerLevel;
          if(response.positions !== undefined){
            let temp = JSON.parse(response.positions);
            if(temp.length > 0){
              this.leaguename = temp[0].leagueName;
              this.tier = temp[0].tier;
              this.leaguepoints = temp[0].leaguePoints;
              this.wins = temp[0].wins;
              this.losses = temp[0].losses;
            }else {
              this.leaguename = 'N/A';
              this.tier = 'N/A';
              this.leaguepoints = 'N/A';
              this.wins = 'N/A';
              this.losses = 'N/A';
            }
          }
          this.recentMatchesRepeat = response.matchList.matches;
          for(var i = 0; i < this.recentMatchesRepeat.length; i++){
            this.recentMatchesRepeat[i].timestamp = new Date(this.recentMatchesRepeat[i].timestamp);
          }
        }
      });
    }else{
      this.$.spinner.active = false;
      this.$.spinner.classList.remove('active');
    }
  }

  _showElement(element) {
    let divsShown = element.querySelectorAll("div");
    divsShown.forEach(function(divItem) {
      if(divItem.classList.contains('filter')){
        divItem.classList.remove('display-none');
      }
    });
  }

  _hideElement(element) {
    let divsShown = element.querySelectorAll("div");
    divsShown.forEach(function(divItem) {
      if(divItem.classList.contains('filter')){
        divItem.classList.add('display-none');
      }
    });
  }

  _checkForEnter(key) {
    if (key.keyCode === 13) {
      this._invokeApi();
    }
  }

  _displayStats() {
    this._hideElement(this.$.recentMatches);
    this._showElement(this.$.searchResults);
  }

  _displayRecentMatches() {
    this._hideElement(this.$.searchResults);
    this._showElement(this.$.recentMatches);
  }
}

window.customElements.define('league-of-legends-ui-app', LeagueOfLegendsUiApp);
