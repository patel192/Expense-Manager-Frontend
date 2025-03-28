import React from "react";
export const Navbar = ({toggleSidebar}) => {
    

  return (
    <div class="inner">
      <header id="header">
        <nav class="main-nav">
            <div>
            <a href="#sidebar" class="toggle" onClick={toggleSidebar} >Toggle</a>
            </div>
          <div class="nav-links">
            <a href="">Home</a>
            <a href="">Features</a>
            <a href="">About</a>
            <a href="">Contact</a>
            <a href="">Login</a>
            <a href="">Signup</a>
          </div>
        </nav>
      </header>

      {/* <!-- Banner --> */}
      <section id="banner">
        <div class="content">
          <header>
            <h1>
              Welcome To
              <br />
              Expense Manager
            </h1>
            <p>Unlock financial freedom, one expense at a time</p>
          </header>
          <p>
            Aenean ornare velit lacus, ac varius enim ullamcorper eu. Proin
            aliquam facilisis ante interdum congue. Integer mollis, nisl amet
            convallis, porttitor magna ullamcorper, amet egestas mauris. Ut
            magna finibus nisi nec lacinia. Nam maximus erat id euismod egestas.
            Pellentesque sapien ac quam. Lorem ipsum dolor sit nullam.
          </p>
          <ul class="actions">
            <li>
              <a href="#" class="button big">
                Learn More
              </a>
            </li>
          </ul>
        </div>
        <span class="image object">
          <img src="src\assets\Images\614y4xnqgdL.png" alt="" />
        </span>
      </section>

      {/* <!-- Section --> */}
      <section>
        <header class="major">
          <h2>Erat lacinia</h2>
        </header>
        <div class="features">
          <article>
            <span class="icon fa-gem"></span>
            <div class="content">
              <h3>Portitor ullamcorper</h3>
              <p>
                Aenean ornare velit lacus, ac varius enim lorem ullamcorper
                dolore. Proin aliquam facilisis ante interdum. Sed nulla amet
                lorem feugiat tempus aliquam.
              </p>
            </div>
          </article>
          <article>
            <span class="icon solid fa-paper-plane"></span>
            <div class="content">
              <h3>Sapien veroeros</h3>
              <p>
                Aenean ornare velit lacus, ac varius enim lorem ullamcorper
                dolore. Proin aliquam facilisis ante interdum. Sed nulla amet
                lorem feugiat tempus aliquam.
              </p>
            </div>
          </article>
          <article>
            <span class="icon solid fa-rocket"></span>
            <div class="content">
              <h3>Quam lorem ipsum</h3>
              <p>
                Aenean ornare velit lacus, ac varius enim lorem ullamcorper
                dolore. Proin aliquam facilisis ante interdum. Sed nulla amet
                lorem feugiat tempus aliquam.
              </p>
            </div>
          </article>
          <article>
            <span class="icon solid fa-signal"></span>
            <div class="content">
              <h3>Sed magna finibus</h3>
              <p>
                Aenean ornare velit lacus, ac varius enim lorem ullamcorper
                dolore. Proin aliquam facilisis ante interdum. Sed nulla amet
                lorem feugiat tempus aliquam.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* <!-- Section --> */}
      <section>
        <header class="major">
          <h2>Ipsum sed dolor</h2>
        </header>
        <div class="posts">
          <article>
            <a href="#" class="image">
              <img src="images/pic01.jpg" alt="" />
            </a>
            <h3>Interdum aenean</h3>
            <p>
              Aenean ornare velit lacus, ac varius enim lorem ullamcorper
              dolore. Proin aliquam facilisis ante interdum. Sed nulla amet
              lorem feugiat tempus aliquam.
            </p>
            <ul class="actions">
              <li>
                <a href="#" class="button">
                  More
                </a>
              </li>
            </ul>
          </article>
          <article>
            <a href="#" class="image">
              <img src="images/pic02.jpg" alt="" />
            </a>
            <h3>Nulla amet dolore</h3>
            <p>
              Aenean ornare velit lacus, ac varius enim lorem ullamcorper
              dolore. Proin aliquam facilisis ante interdum. Sed nulla amet
              lorem feugiat tempus aliquam.
            </p>
            <ul class="actions">
              <li>
                <a href="#" class="button">
                  More
                </a>
              </li>
            </ul>
          </article>
          <article>
            <a href="#" class="image">
              <img src="images/pic03.jpg" alt="" />
            </a>
            <h3>Tempus ullamcorper</h3>
            <p>
              Aenean ornare velit lacus, ac varius enim lorem ullamcorper
              dolore. Proin aliquam facilisis ante interdum. Sed nulla amet
              lorem feugiat tempus aliquam.
            </p>
            <ul class="actions">
              <li>
                <a href="#" class="button">
                  More
                </a>
              </li>
            </ul>
          </article>
          <article>
            <a href="#" class="image">
              <img src="images/pic04.jpg" alt="" />
            </a>
            <h3>Sed etiam facilis</h3>
            <p>
              Aenean ornare velit lacus, ac varius enim lorem ullamcorper
              dolore. Proin aliquam facilisis ante interdum. Sed nulla amet
              lorem feugiat tempus aliquam.
            </p>
            <ul class="actions">
              <li>
                <a href="#" class="button">
                  More
                </a>
              </li>
            </ul>
          </article>
          <article>
            <a href="#" class="image">
              <img src="images/pic05.jpg" alt="" />
            </a>
            <h3>Feugiat lorem aenean</h3>
            <p>
              Aenean ornare velit lacus, ac varius enim lorem ullamcorper
              dolore. Proin aliquam facilisis ante interdum. Sed nulla amet
              lorem feugiat tempus aliquam.
            </p>
            <ul class="actions">
              <li>
                <a href="#" class="button">
                  More
                </a>
              </li>
            </ul>
          </article>
          <article>
            <a href="#" class="image">
              <img src="images/pic06.jpg" alt="" />
            </a>
            <h3>Amet varius aliquam</h3>
            <p>
              Aenean ornare velit lacus, ac varius enim lorem ullamcorper
              dolore. Proin aliquam facilisis ante interdum. Sed nulla amet
              lorem feugiat tempus aliquam.
            </p>
            <ul class="actions">
              <li>
                <a href="#" class="button">
                  More
                </a>
              </li>
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
};
