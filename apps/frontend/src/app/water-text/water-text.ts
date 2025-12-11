import { Component, input } from "@angular/core";

@Component({
  selector: 'app-water-text',
  standalone: true,
  templateUrl: './water-text.html',
  styleUrls: ['./water-text.scss'],
})
export class WaterText {
  readonly text = input('WATER');
  readonly fontSize = input(220);      // px inside SVG
  readonly width = input(1200);        // SVG view width
  readonly height = input(300);        // SVG view height
  readonly waveSpeed1 = input(8);      // seconds for front wave
  readonly waveSpeed2 = input(12);     // seconds for back wave
}