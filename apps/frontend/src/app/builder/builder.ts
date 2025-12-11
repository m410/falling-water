import { DecimalPipe } from '@angular/common';
import { Component, signal, ViewEncapsulation } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from "@angular/router";
import { SystemOptions } from "../system/system-options";


@Component({
  selector: 'app-builder',
  imports: [ReactiveFormsModule, RouterLink, SystemOptions],
  templateUrl: './builder.html',
  styles: ``,
  encapsulation: ViewEncapsulation.None,
})
export class Builder {
  protected readonly output = signal(0);
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
  protected readonly form = new FormGroup({
    flowRate: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    flowRateUnit: new FormControl<string | null>(null, [Validators.required]),
    headerHeight: new FormControl<number | null>(null,[Validators.required, Validators.min(0.01)]),
    headerHeightUnit: new FormControl<string | null>(null,[Validators.required]),
    efficiency: new FormControl(70, [Validators.required, Validators.min(1), Validators.max(100)]),
  });
  // // protected readonly form = form(signal({
  //   flowRate: 0,
  //   headerHeight: 0,
  //   efficiency: 0.9,
  // }))

  // The theoretical hydraulic power from water is given by:
  // P=η⋅ρ⋅g⋅Q⋅H
  // Where:
  // P = Power output (Watts, W)
  // η = Overall efficiency of the system (decimal, e.g., 0.7 for 70%)
  // ρ = Density of water (≈ 1000 kg/m³)
  // g = Acceleration due to gravity (≈ 9.81 m/s²)
  // Q = Flow rate (m³/s)
  // H = Head height (m)

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const flowRate = this.form.value.flowRate!;
      const flowRateUnit = this.form.value.flowRateUnit!;
      const headerHeight = this.form.value.headerHeight!;
      const headerHeightUnit = this.form.value.headerHeightUnit!;
      const efficiency = this.form.value.efficiency! / 100; // Convert percentage to decimal}
      const rate =
        this.flowRate(flowRate, flowRateUnit) *
        this.headerHeight(headerHeight, headerHeightUnit) *
        efficiency *
        1000 * // density of water
        9.81; // gravity
      this.output.set(rate);
    }
  }

  protected invalid(arg0: string) {
    return this.form.get(arg0)?.invalid && this.form.get(arg0)?.touched
  }

  protected valid(arg0: string) {
    return this.form.get(arg0)?.valid && this.form.get(arg0)?.touched
  }
  

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
