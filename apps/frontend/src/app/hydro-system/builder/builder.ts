import { Component, output, signal, ViewEncapsulation } from '@angular/core';

import { RouterLink } from '@angular/router';

import { form, Field, min, max } from '@angular/forms/signals';
import { PowerOutput } from './power-output';

@Component({
  selector: 'app-builder',
  imports: [RouterLink, Field],
  templateUrl: './builder.html',
  styles: ``,
  encapsulation: ViewEncapsulation.None,
})
export class Builder {
  readonly result = output<PowerOutput>();

  protected readonly flowRateUnits = [
    { label: 'Cubic meters per second (m³/s)', value: 'cms' },
    { label: 'Liters per second (L/s)', value: 'lps' },
    { label: 'Gallons per minute (gpm)', value: 'gpm' },
    { label: 'Gallons per second (gps)', value: 'gps' },
    { label: 'Cubic feet per second (cfs)', value: 'cfs' },
  ];
  protected readonly headerHeightUnits = [
    { label: 'Meters (m)', value: 'mt' },
    { label: 'Feet (ft)', value: 'ft' },
  ];

  readonly powerOutput = signal<PowerOutput>({
    flowRate: 0,
    flowRateUnit: 'cms',
    headerHeight: 0,
    headerHeightUnit: 'mt',
    efficiency: 70,
  });

  readonly powerOutputForm = form(this.powerOutput, (path) => {
    min(path.flowRate, 1);
    min(path.headerHeight, 1);
    min(path.efficiency, 1);
    max(path.efficiency, 100);
  });

  // The theoretical hydraulic power from water is given by:
  // P=η⋅ρ⋅g⋅Q⋅H
  // Where:
  // P = Power output (Watts, W)
  // η = Overall efficiency of the system (decimal, e.g., 0.7 for 70%)
  // ρ = Density of water (≈ 1000 kg/m³)
  // g = Acceleration due to gravity (≈ 9.81 m/s²)
  // Q = Flow rate (m³/s)
  // H = Head height (m)

  onSubmit($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();

    // this.powerOutputForm.markAllAsTouched();

    const flowRate = this.powerOutputForm.flowRate().value();
    const flowRateUnit = this.powerOutputForm.flowRateUnit().value();
    const headerHeight = this.powerOutputForm.headerHeight().value();
    const headerHeightUnit = this.powerOutputForm.headerHeightUnit().value();
    const efficiency = this.powerOutputForm.efficiency().value() / 100; // Convert percentage to decimal}
    const rate =
      this.flowRate(flowRate, flowRateUnit) *
      this.headerHeight(headerHeight, headerHeightUnit) *
      efficiency *
      1000 * // density of water
      9.81; // gravity

    const out = { rate: rate, ...this.powerOutput() };
    this.result.emit(out);
  }

  // protected invalid(arg0: string) {
  //   return this.form.get(arg0)?.invalid && this.form.get(arg0)?.touched
  // }

  // protected valid(arg0: string) {

  //   return this.form.get(arg0)?.valid && this.form.get(arg0)?.touched
  // }

  private readonly headerHeight = (height: number, unit: string) => {
    switch (unit) {
      case 'mt':
        return height;
      case 'ft':
        return height * 0.3048;
      default:
        return height;
    }
  };

  private readonly flowRate = (flow: number, unit: string) => {
    switch (unit) {
      case 'cms':
        return flow;
      case 'lps':
        return flow / 1000;
      case 'gpm':
        return flow * 0.00006309;
      case 'gps':
        return flow * 0.003785411784;
      case 'cfs':
        return flow * 0.0283168;
      default:
        return flow;
    }
  };
}
