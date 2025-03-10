import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectUser,
  selectUsersError,
  selectUsersLoading,
} from 'src/app/state/selectors/users.selectors';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  userLoading$ = this.store.select(selectUsersLoading);
  userError$ = this.store.select(selectUsersError);
  user$ = this.store.select(selectUser);

  messages: string[] = [
    '🎾 El partido más largo de la historia duró 11 horas y 5 minutos en Wimbledon 2010.',
    '🔥 El saque más rápido registrado fue de 263 km/h por Sam Groth en 2012.',
    '🏆 Rafael Nadal ha ganado Roland Garros 14 veces, un récord impresionante.',
    '🎯 Roger Federer tiene más de 100 títulos ATP, siendo uno de los más exitosos de la historia.',
    '🌍 El tenis se juega en todas las superficies: césped, arcilla, pista dura y moqueta.',
    '👑 Novak Djokovic ostenta el récord de más semanas como número 1 del mundo.',
    '🥎 El Open de Australia usa más de 48,000 pelotas de tenis cada año.',
    '🏅 Venus y Serena Williams han ganado juntas 14 títulos de Grand Slam en dobles.',
    '⏳ El partido más corto duró solo 28 minutos: Steffi Graf venció 6-0, 6-0 en 1988.',
    '🏛️ El tenis se originó en Francia en el siglo XII con el juego "jeu de paume".',
    '🎾 Martina Navratilova ganó Wimbledon 9 veces, el récord en individuales femeninos.',
    '🇪🇸 España ha ganado la Copa Davis en múltiples ocasiones con jugadores legendarios.',
    '💪 Björn Borg se retiró a los 26 años tras haber ganado 11 títulos de Grand Slam.',
    '🔥 Andy Murray es el único tenista en ganar dos medallas de oro olímpicas en individuales.',
    '🎾 La línea de base en una pista de tenis mide 8.23 metros de ancho.',
    '📏 La red tiene una altura de 91.4 cm en el centro y 1.07 m en los postes.',
    '🎾 El Grand Slam más joven de la historia lo ganó Michael Chang con 17 años en 1989.',
    '⏳ Chris Evert tiene el récord de más finales de Grand Slam consecutivas (34).',
    '🏆 Serena Williams ha ganado 23 títulos de Grand Slam en la era Open.',
    '🎾 Un partido de tenis se juega con una pelota de 6.54 a 6.86 cm de diámetro.',
    '🔥 Ivan Lendl jugó 19 finales de Grand Slam, ganando 8 títulos.',
    '📺 El primer partido de tenis transmitido por TV fue en 1937.',
    '🎾 Los tenistas pueden correr hasta 5 km en un partido de 5 sets.',
    '👟 Las zapatillas de tenis tienen un diseño especial para cambios rápidos de dirección.',
    '💨 La velocidad promedio de un saque en la ATP es de 190 km/h.',
    '🏅 El tenis se convirtió en deporte olímpico en 1896, pero fue retirado y volvió en 1988.',
    '🎾 Pete Sampras terminó como número 1 del mundo por seis años consecutivos.',
    '🚀 El primer jugador en lograr el "Golden Slam" (los 4 Grand Slams y oro olímpico en un año) fue Steffi Graf en 1988.',
    '🎾 La Copa Davis es la competición por equipos más importante del tenis masculino.',
    '🏆 La Fed Cup es el equivalente de la Copa Davis en tenis femenino.',
    '🎾 Andre Agassi ganó los 4 Grand Slams en distintas superficies.',
    '💥 Gaël Monfils es conocido por tener algunos de los golpes más potentes del circuito.',
    '🏆 Boris Becker ganó Wimbledon con solo 17 años en 1985.',
    '🎾 Los jugadores pueden golpear la pelota en el aire (volea) o dejar que bote antes.',
    '👑 Rod Laver es el único tenista que ha ganado el Grand Slam en dos ocasiones.',
    '🔥 Rafael Nadal tiene el récord de más títulos de Masters 1000 ganados en la historia.',
    '🎾 En un partido, un jugador puede recorrer hasta 10 km.',
    '⏳ Serena Williams ha jugado más de 1,000 partidos en su carrera profesional.',
    '🏅 Novak Djokovic ha superado los 20 títulos de Grand Slam.',
    '🔥 En los torneos de Grand Slam, los partidos de hombres son al mejor de 5 sets.',
    '🎾 En los años 70, los jugadores podían usar pantalones largos en Wimbledon.',
    '📺 La final de Wimbledon de 2008 entre Federer y Nadal es considerada la mejor de la historia.',
    '🎾 Las raquetas han evolucionado de madera a grafito y fibra de carbono.',
    '🔥 En el tenis, el término "deuce" significa que ambos jugadores tienen el mismo puntaje y necesitan ganar dos puntos seguidos para ganar el juego.',
    '🎾 Roger Federer ha jugado más de 1,500 partidos en su carrera.',
    '🏆 Margaret Court ostenta el récord de más títulos de Grand Slam (24).',
    '🎾 En la ATP, los puntos para el ranking se renuevan cada 52 semanas.',
    '⏳ El tenis en silla de ruedas sigue las mismas reglas que el tenis convencional, pero la pelota puede botar dos veces.',
    '🔥 Un partido de tenis puede durar minutos o superar las 6 horas.',
    '🎾 Se estima que en un Grand Slam, un jugador golpea la pelota más de 3,000 veces.'
  ];

  constructor(
    private readonly store: Store<any>,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}
}
