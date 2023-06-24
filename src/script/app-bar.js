class AppBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <div class="d-flex justify-content-between mb-1 align-items-center" id="navbarHead">
    <h2>TMovie</h2>
    <button class="navbar-toggler border border-danger rounded p-0 fs-1 d-sm-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#asideNav" aria-controls="offcanvasDarkNavbar">
      <span><i class="bi bi-list text-danger"></i></span>
    </button>
    </div>
    `;
  }
}

customElements.define("app-bar", AppBar);
