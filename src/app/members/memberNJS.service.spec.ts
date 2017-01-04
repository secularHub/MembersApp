/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MemberNJSService } from './memberNJS.service';

describe('MemberService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MemberNJSService]
    });
  });

  it('should ...', inject([MemberNJSService], (service: MemberNJSService) => {
    expect(service).toBeTruthy();
  }));
});
