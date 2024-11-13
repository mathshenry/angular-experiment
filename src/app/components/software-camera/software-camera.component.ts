import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { merge } from 'rxjs';
import { MinMax } from '../../interfaces';

// THIS COMPONENT COULD'VE BEEN BROKEN INTO SMALLER PIECES, BUT I DON'T HAVE MUCH TIME TO WORK ON IT
@Component({
  selector: 'app-software-camera',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './software-camera.component.html',
  styleUrl: './software-camera.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoftwareCameraComponent { 
  private readonly formBuilder = inject(FormBuilder);
  protected softwareCameraFG = this.createCameraFG();
  protected hardwareCameraFGArray = this.formBuilder.array([
    this.createCameraFG()
  ]);
  protected approvedCamerasIndexes = signal<number[]>([]);
  protected hasComputed = signal<boolean>(false);

  protected addNewHardwareCamera():void {
    this.hardwareCameraFGArray.push(this.createCameraFG());
  }

  private createCameraFG(): FormGroup {
    return new FormGroup({
      lightLevel: this.createMinMaxFG(),
      subjectDistance: this.createMinMaxFG(),
    });
  }

  private createMinMaxFG(): FormGroup {
    return new FormGroup({
      min: new FormControl(0),
      max: new FormControl(1)
    }, [this.minMaxValidator])
  }

  protected removeHardwareCamera(index: number){
    this.hardwareCameraFGArray.controls.splice(index, 1);
  }

  constructor() {
    merge(this.hardwareCameraFGArray.valueChanges,  this.softwareCameraFG.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(()  => this.hasComputed.set(false));
  }

  protected minMaxValidator(formGroup: AbstractControl): {[index: string]: boolean} {
    const invalid = formGroup.get('min')?.value >= formGroup.get('max')?.value;
    return invalid ? {invalid: true} : {};
  }

  protected calculateCameras(): void {
    this.hasComputed.set(true);

    const lightLevelRequired = this.softwareCameraFG.get('lightLevel')?.value;
    const subjectDistanceRequired = this.softwareCameraFG.get('subjectDistance')?.value;

    const approvedIndexes = this.hardwareCameraFGArray.controls.reduce((approvedArray, cameraFG, index) => {
      const validLighLevels = this.validateMinMax(lightLevelRequired, cameraFG.get('lightLevel')?.value);
      const validSubjectDistance= this.validateMinMax(subjectDistanceRequired, cameraFG.get('subjectDistance')?.value);

      if(validLighLevels && validSubjectDistance){
        approvedArray.push(index);
      }

      return approvedArray;
    }, [] as number[]);

    this.approvedCamerasIndexes.set(approvedIndexes);

    if(!this.approvedCamerasIndexes().length){
      window.alert('No Hardware camera fits the needs');
    }
  }

  private validateMinMax(required: MinMax, value: MinMax): boolean {
    return value.min <= required.min && value.max >= required.max;
  }
}
