"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const nav = document.querySelector(".nav");

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

////////////////////////////
//button scrolling

//getBoundingClientRect method returns a DOMRect object
// const s1coords = section1.getBoundingClientRect();
// console.log(s1coords);

// console.log(e.target.getBoundingClientRect());

// console.log("current scroll (X/Y)", window.pageXOffset, window.pageYOffset);

//Scrolling
// window.scrollTo(
//   s1coords.left + window.pageXOffset,
//   s1coords.top + window.pageYOffset
// );

//old-school way
// window.scrollTo({
//   left: s1coords.left + window.pageXOffset,
//   top: s1coords.top + window.pageYOffset,
//   behavior: "smooth",
// });

btnScrollTo.addEventListener("click", function (e) {
  section1.scrollIntoView({
    behavior: "smooth",
  });
});

//Tabbed component

tabsContainer.addEventListener("click", function (e) {
  //using .closest so that the tab will be clicked
  //regardless where the user clicks at on the button
  const clicked = e.target.closest(".operations__tab");

  //Guard clause
  if (!clicked) return;

  //remove active classes
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  //Activate tab
  clicked.classList.add("operations__tab--active");

  //Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//Menu fade animation

//refactored code
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    //changes the opacity of the logo and links
    //'this' keyword is now opacity
    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//passing "argument" into handler
//opacity changes to 0.5
nav.addEventListener("mouseover", handleHover.bind(0.5));
//opacity back to 1
nav.addEventListener("mouseout", handleHover.bind(1));

// //Sticky navigation

// //obtains the values of the coordinates in the page
// const initialCoords = section1.getBoundingClientRect();

// console.log(initialCoords);

// window.addEventListener('scroll', function(e){
//   console.log(window.scrollY);

//   if(window.scrollY > initialCoords.top)
//   {
//     nav.classList.add('sticky')
//   }
//    else {
//      nav.classList.remove('sticky')
//     }
// })

//Sticky navigation: Intersection Observer API

// const obsCallback = function(entries, observer){
//   entries.forEach(entry => {
//     console.log(entry);
//   })
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  //pixels only work
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//Reveal sections
const allSections = document.querySelectorAll(".section");
const revealSection = function (entries, observer) {
  const [entry] = entries;

  //guard clause
  if (!entry.isIntersecting) return;

  //when scrolling down, section will be revealed
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

//using the intersectionObsever API again
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  //making the sections hidden
  //section.classList.add("section--hidden");
});

//Lazy loading images
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);
  //Guard clause
  if (!entry.isIntersecting) return;
  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});
imgTargets.forEach((img) => imgObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  //Functions
  //creating the Dot elements here
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  //Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  //Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  });

  //dot event listener
  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
///////////////////////////
//Page navigation

// //This is one way to do it
// //but it is very inefficient
// document.querySelectorAll(".nav__link").forEach(function (el) {
//   el.addEventListener("click", function (e) {
//     //preventing the anchors in the HTML from happening
//     e.preventDefault();
//     //grabs the href
//     const id = this.getAttribute("href");
//     console.log(id);
//     document.querySelector(id).scrollIntoView({
//       behavior: "smooth",
//     });
//   });
// });

//Event delegation is a better way
//1. Add event listener to common parent element
//2. Determine what element originated the event

document.querySelector(".nav__links").addEventListener("click", function (e) {
  //e.target is a useful tool in our strategy here
  //we can see where the event happened
  // console.log(e.target);
  e.preventDefault();

  //Matching strategy
  if (e.target.classList.contains("nav__link")) {
    //grabs the href
    const id = e.targetthis.getAttribute("href");
    console.log(id);
    document.querySelector(id).scrollIntoView({
      behavior: "smooth",
    });
  }
});

///////////////////////////////
///Experimenting DOM and Events
///////////////////////////////

// //Selecting and Deleting Elements

// //Selecting an element from the page
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// //returns the first element that has header
// const header = document.querySelector(".header");
// //selects all elements with 'section'
// const allSections = document.querySelectorAll(".section");
// console.log(allSections);

// document.getElementById("section--1");

// //Returns an HTML collection
// const allButtons = document.getElementsByTagName("button");
// console.log(allButtons);

// //returns a live HTML collection
// console.log(document.getElementsByClassName("btn"));

// //Creating and inserting elements
// const message = document.createElement("div");
// message.classList.add("cookie-message");
// //message.textContent = "We use cookies for improved functionalty and analytics";
// message.innerHTML =
//   'We use cookies for improved functionalty and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// //We can use the prepend and append to not only insert element but also move it
// //header.prepend(message);
// header.append(message);
// //header.append(message.cloneNode(true));

// //header.before(message);
// //header.after(message);

// //Delete elements
// //This will remove the cookie message on the bottom
// //Using the .remove();
// document
//   .querySelector(".btn--close-cookie")
//   .addEventListener("click", function () {
//     message.remove();
//   });

// //Styles
// message.style.backgroundColor = "#37383d";
// message.style.width = "120%";

// console.log(message.style.height);
// console.log(message.style.backgroundColor);

// //contains all of the properties of the value
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// //changes the height of the message
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px";

// //Easily change the stlye of the page
// document.documentElement.style.setProperty("--color-primary", "orangered");

// //Attributes
// const logo = document.querySelector(".nav__logo");
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);

// logo.alt = "Beautiful minimalist logo";

// //Non-standard
// console.log(logo.designer);
// console.log(logo.getAttribute("designer"));
// logo.setAttribute("company", "Bankist");

// //the absolute URL of the image
// console.log(logo.src);
// //the literal URL of the image
// console.log(logo.getAttribute("src"));

// //link attributes
// const link = document.querySelector(".twitter-link");
// console.log(link.href);
// console.log(link.getAttribute("href"));

// //Classs
// logo.classList.add("c");
// logo.classList.remove("c");
// logo.classList.toggle("c");
// logo.classList.contains("c"); //not includes

// // Don't use
// // logo.className = "daniel";

//event listener

// const h1 = document.querySelector("h1");

// const alertH1 = function (e) {
//   alert("addEventListner: Great! you are reading the heading!");

//   //we remove the event listener here
//   h1.removeEventListener("mouseenter", alertH1);
// };

//mouseenter is an event wherever the mouse is hovered over
// h1.addEventListener("mouseenter", alertH1);

// //remove events by using the setTimeout
// setTimeout(() => h1.removeEventListener("mouseenter", alertH1), 3000);

//This is more of an old school way
// h1.onmouseenter = function (e) {
//   alert("addEventListner: Great! you are reading the heading!");
// };

// //EVENT PROPAGATION
// // rgb(255,255,255)

// //The event happens in the document root
// //and then it goes to the target
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector(".nav__link").addEventListener("click", function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log("LINK", e.target, e.currentTarget);

//   //Stop the propagation
//   //e.stopPropagation();
// });

// document.querySelector(".nav__links").addEventListener("click", function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log("CONTAINER", e.target, e.currentTarget);
// });

// document.querySelector(".nav").addEventListener("click", function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log("NAV", e.target, e.currentTarget);
// });

// //TRAVERSING DOM
// const h1 = document.querySelector("h1");

// //Going downwards: child
// console.log(h1.querySelectorAll(".highlight"));
// console.log(h1.childNodes);
// //gives us an HTML collection
// console.log(h1.children);
// //sets the first child to white
// h1.firstElementChild.style.color = "white";
// h1.lastElementChild.style.color = "pink";

// //Going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// //returns the closet element
// h1.closest(".header").style.background = "var(--gradient-secondary)";
// h1.closest(".header").style.background = "var(--gradient-primary)";

// //Going sideways: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// //gets all of the siblings
// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = "scale(0.5)";
// });
