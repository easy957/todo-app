import * as introJs from 'intro.js';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IntroService {
  private static INTRO_VIEWED_KEY = 'intro-viewed';
  private static INTRO_VIEWED_VALUE = 'done';

  private introJS = introJs();

  constructor() {}

  public startIntroJS(checkViewed: boolean): void {
    this.introJS.setOptions({
      nextLabel: 'след. >',
      prevLabel: '< пред.',
      doneLabel: 'Понятно',
      skipLabel: 'Выход',
      exitOnEsc: true,
      exitOnOverlayClick: false,
      disableInteraction: true,
    });

    this.introJS.start();

    this.introJS.onexit((_: any) =>
      localStorage.setItem(
        IntroService.INTRO_VIEWED_KEY,
        IntroService.INTRO_VIEWED_VALUE
      )
    );
  }
}
