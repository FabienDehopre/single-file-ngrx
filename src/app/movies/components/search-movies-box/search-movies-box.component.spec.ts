import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMoviesBoxComponent } from './search-movies-box.component';

describe('SearchMoviesBoxComponent', () => {
  let component: SearchMoviesBoxComponent;
  let fixture: ComponentFixture<SearchMoviesBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchMoviesBoxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchMoviesBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
