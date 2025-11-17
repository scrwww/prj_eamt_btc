import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MinerPage } from './miner.page';

describe('MinerPage', () => {
  let component: MinerPage;
  let fixture: ComponentFixture<MinerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MinerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
