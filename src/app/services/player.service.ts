import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player } from '../interfaces/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playersDb: AngularFireList<Player>;

  constructor(private db: AngularFireDatabase) {
    this.playersDb = this.db.list('/players', ref => ref.orderByChild('name'));
 
  }

  getPlayers(): Observable<Player[]> {
    //snapshotChanges Cambios Instantaneos (snap - chasquido)
    return this.playersDb.snapshotChanges().pipe(
      map(changes => { 
        return changes.map(c => ({$key: c.payload.key, ...c.payload.val()}))
      })
    );
  }

  addPlayer(player: Player) {
    return this.playersDb.push(player);
  }

  deletePlayer(id: string) {
    this.db.list('/players').remove(id);
  }

  editPlayer(newPlayerData: Player) {
    const $key = newPlayerData.$key;
    /*Se elimina porque Firebase no acepta tanto en el insert como en el update que ya se contenga una key,
    la idea es que al insertar o actualizar el objeto no contenga keys*/
    delete(newPlayerData.$key);
    this.db.list('/players').update($key, newPlayerData);
  }




  
}
