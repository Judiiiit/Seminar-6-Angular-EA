import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgUserSync } from './org-user-sync';

describe('OrgUserSync', () => {
  let component: OrgUserSync;
  let fixture: ComponentFixture<OrgUserSync>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgUserSync],
    }).compileComponents();

    fixture = TestBed.createComponent(OrgUserSync);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
