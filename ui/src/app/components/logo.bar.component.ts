import { Component } from '@angular/core';

import { ctxpath } from '../config/globals';

@Component({
  selector: '.logo-bar',
  templateUrl: '../templates/logo.bar.component.html'
})
export class LogoBarComponent {
    ctxpath: string = ctxpath;
}
