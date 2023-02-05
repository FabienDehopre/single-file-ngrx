import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMoviesPageComponent } from './search-movies-page.component';

describe('SearchMoviesPageComponent', () => {
  let component: SearchMoviesPageComponent;
  let fixture: ComponentFixture<SearchMoviesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchMoviesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchMoviesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
