import {Component} from '@angular/core';
import { ViewChild } from '@angular/core';
import {ZXingScannerComponent} from '@zxing/ngx-scanner';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  scannerActive = false;

  @ViewChild('scanner', { static: false })
  scanner: ZXingScannerComponent;
  private theBackCamera: any;

  /**
   * Some method.
   */
  doSomething(): void {
    this.scanner.device = this.getBackCamera();
  }

  scanSuccessHandler($event) {
    console.log($event);
    this.startScanner();
  }

  /**
   * Returns the back camera for ya.
   */
  getBackCamera() {
    return this.theBackCamera;
  }

  startScanner() {
    this.scannerActive = !this.scannerActive;
  }

  constructor() {}

}
