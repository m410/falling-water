import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-look',
  imports: [],
  template: `
    <div class="container">
      <header class="row mb-5 mt-3">
        <div class="col-12 col-md-5 offset-md-1 d-flex">
          <h1 class="display-5 float-md-start mb-0">
            <img src="falling-water-logo2.svg" alt="falling water energy logo" height="48px">
            Falling water energy
          </h1>
        </div>
        <div class="col-12 col-md-5  d-flex justify-content-end align-items-center">
          <ul class="nav nav-underline mt-3 ">

            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Design</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <i class="bi bi-envelope"></i>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <i class="bi bi-cart4"></i>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                <i class="bi bi-person-circle"></i>
              </a>
            </li>
          </ul>
        </div>
      </header>
      <div class="row mt-4 mb-4">
        <main class="col-md-10 offset-md-1 text-center p-3">

          <img style="border-radius: 1rem" class="img-fluid shadow mb-3 mt-3" src="system-ai-gen.jpg"
               alt="AI generated image of micro-hydro system">

          <p class="mt-3">
            <strong>falling-water.energy</strong> designs and builds micro-hydro power systems that turn flowing water
            into dependable,
            clean electricity. We specialize in efficient, small-scale solutions that work with nature instead of
            against
            it—using existing streams, elevation changes, and infrastructure to generate power with minimal
            environmental
            impact. Whether for remote sites, resilient homes, or off-grid projects, our systems are engineered for
            durability, performance, and long-term sustainability, delivering renewable energy where it matters most.
          </p>
          <p>
            <button class="btn btn-lg btn-primary">Hydro Calculator</button>
          </p>
        </main>
      </div>
      <div class="row mt-4">
        <footer class="col-md-8 offset-md-2 text-muted text-center">
          <p>Some footer text here <a href="someplace">My name</a>.</p>
        </footer>
      </div>

    </div>
  `,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class Look {

}
