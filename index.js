// content custom text style parameters
const buttonText = 'Table of Content';
const buttonFontSize = '18px';
const buttonWidth = '160';
const fontFamily = '';
const h1FontSize = '18px';
const h2FontSize = '16px';
const sideNavBackground = '#eceff1';
const sideNavWidth = '300';
const h1Color = '#4c4c4c';
const h2Color = '#484848';
const iconSize = '26px';
const iconColor = '#506578';

// elements styles
const style = {
    sideNav: `z-index: 110; height: 100vh; width: 0; overflow: hidden; position: fixed; padding: 20px 0; top: 0; left: 0; background: ${sideNavBackground}; transition: 300ms`,
    sectionContainer: 'display: flex; margin: 0 0 20px 20px;',
    sectionText: `font-size: ${h1FontSize}; overflow: hidden; width: ${sideNavWidth * 0.75}px; font-weight: bold; cursor: pointer; font-family: ${fontFamily}; color: ${h1Color}`,
    sectionIcon: 'cursor: pointer',
    titleContainer: 'max-height: 0; transition: max-height 0.1s ease-out; overflow: hidden; padding: 5px 0 0 20px',
    titleText: `font-size: ${h2FontSize}; overflow: hidden; width: ${sideNavWidth * 0.75}px; font-family: ${fontFamily}; color: ${h2Color}; cursor: pointer; padding: 3px 0`,
    button: `z-index: 110; transform: rotate(-90deg); width: ${buttonWidth}px; position: fixed; top: 100px; left: -${buttonWidth/2 + 1}px; transition: 300ms; background: ${sideNavBackground}; padding: 0 20px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 0 0 10px 10px; color: ${h1Color}; font-size: ${buttonFontSize}; box-shadow: 0 3px 4px 0 rgba(0,0,0,.1); cursor: pointer`,
    screenLayer: 'width: 100vw; height: 100vh; display: none; position: fixed; top: 0; left: 0; z-index: 100',
    iconContainer: `width: ${iconSize}; overflow: hidden`,
};

// define open/close icon for sections
const closed = '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M11.71 15.29l2.59-2.59c.39-.39.39-1.02 0-1.41L11.71 8.7c-.63-.62-1.71-.18-1.71.71v5.17c0 .9 1.08 1.34 1.71.71z"/>';
const opened = '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M8.71 11.71l2.59 2.59c.39.39 1.02.39 1.41 0l2.59-2.59c.63-.63.18-1.71-.71-1.71H9.41c-.89 0-1.33 1.08-.7 1.71z"/>';

// define title boxes openflag Map
var titleFlag = new Map();

// define flag map for sections to check if they have any h2 title
var haveTitle = new Map();

// define global variables
var sections;
var titles; 

// remove space in tag's content so they can be used as id
const removeSpace = (name) => name.replaceAll(' ', '-');
// scroll to view function
function goto (type, index) {
    switch (type) {
        case 'section':
            sections[index].scrollIntoView({behavior: 'smooth'});
            // only open the title box when section clicked
            if (!titleFlag.get(`section-${index}`))
                showTitles(index);
            break;
        case 'title':
            titles[index].scrollIntoView({behavior: 'smooth'});
            break;
    }
}
// show section's titles when click on it
function showTitles (id) {
    let container = document.getElementById("section-" + id);
    let icon = document.getElementById("section-icon-" + id);
    if (titleFlag.get(`section-${id}`)) {
        container.style.maxHeight = "0";
        container.style.transition = "max-height 0.1s ease-out";
        icon.innerHTML = closed;
        titleFlag.set(`section-${id}`, false);
    } else {
        container.style.maxHeight = "1000px";
        container.style.transition = "max-height 0.5s ease-in";
        icon.innerHTML = opened;
        titleFlag.set(`section-${id}`, true);
    }
}

// run script after window created
window.onload = () => {
    // get all objects
    sections = document.getElementsByTagName("h1");
    titles = document.getElementsByTagName("h2");

    // create table of content
    var contentList = '';
    for (let i = 0; i < sections.length - 1; i ++) {
        haveTitle.set(i, false);
        contentList += `<div style="${style.sectionContainer}">`;
        contentList += `<div style="${style.iconContainer}">`;
        contentList += `<svg style="${style.sectionIcon}" id="section-icon-${i}" onclick="showTitles(${i})" height="${iconSize}" viewBox="0 0 24 24" width="${iconSize}" fill="${iconColor}">${closed}</svg>`;
        contentList += '</div><div>';
        contentList += `<div style="${style.sectionText}" onclick="goto('section', ${i})">${sections[i].innerText}</div>`;
        titleFlag.set(`section-${i}`, false);
        contentList += `<div style="${style.titleContainer}" id="section-${i}">`;
        for (let j = 0; j < titles.length; j ++) {
            if (titles[j].offsetTop > sections[i].offsetTop && titles[j].offsetTop < sections[i + 1].offsetTop) {
                haveTitle.set(i, true);
                contentList += `<div style="${style.titleText}" onclick="goto('title', '${j}')">${titles[j].innerText}</div>`;
            }
        }
        contentList += '</div></div></div>';
    }
    // we add the last one outside the loop cause we got problem with i+1 if we put it in there
    const last = sections.length - 1;
    haveTitle.set(last, false);
    contentList += `<div style="${style.sectionContainer}">`;
    contentList += `<div style="${style.iconContainer}">`;
    contentList += `<svg style="${style.sectionIcon}" id="section-icon-${last}" onclick="showTitles(${last})" height="${iconSize}" viewBox="0 0 24 24" width="${iconSize}" fill="${iconColor}">${closed}</svg>`;
    contentList += '</div><div>';
    contentList += `<div style="${style.sectionText}" onclick="goto('section', ${last})">${sections[last].innerText}</div>`;
    titleFlag.set(`section-${last}`, false);
    contentList += `<div style="${style.titleContainer}" id="section-${last}">`;
    for (let j = 0; j < titles.length; j ++) {
        if (titles[j].offsetTop > sections[last].offsetTop) {
            haveTitle.set(last, true);
            contentList += `<div style="${style.titleText}" onclick="goto('title', '${j}')">${titles[j].innerText}</div>`;
        }
    }
    contentList += '</div></div></div>';

    // add created table to DOM
    var menu = document.createElement("div");
    menu.innerHTML = contentList;
    menu.style = style.sideNav;
    menu.setAttribute("id", "tableOfContent");
    document.body.appendChild(menu);

    // create navbar open button
    var button = document.createElement("div");
    button.setAttribute("id", "sideNavBtn");
    button.innerText = buttonText;
    button.style = style.button;
    document.body.appendChild(button);

    // create layer on screen to listen close navbar
    var layer = document.createElement("div");
    layer.setAttribute("id", "screenLayer");
    layer.style = style.screenLayer;
    document.body.appendChild(layer);

    const navbar = document.getElementById("tableOfContent");
    const btn = document.getElementById("sideNavBtn");
    const listener = document.getElementById("screenLayer");
    var navbarFlag = false;

    // open navbar function
    const open = () => {
        navbar.style.width = `${sideNavWidth}px`;
        btn.style.left = `${sideNavWidth - buttonWidth / 2 - 1}px`;
        listener.style.display = "block";
        navbarFlag = true;

        // check if section has any H2
        haveTitle.forEach((value, id) => {
            if (!value)
                document.getElementById("section-icon-" + id).style.display = "none";
        })
    }

    // close navbar function
    const close = () => {
        navbar.style.width = "0";
        btn.style.left = `-${buttonWidth/2 + 1}px`;
        listener.style.display = "none";
        navbarFlag = false;
    }

    // open navbar on button click (for mobile)
    btn.onclick = () => {
        if (navbarFlag)
            close();
        else
            open();
    };

    // open navbar on button hover
    btn.onmouseover = () => open();
    navbar.onmouseover = () => open();

    // close navbar on leave
    btn.onmouseleave = () => close();
    navbar.onmouseleave = () => close();

    //close navbar when tap on screen
    listener.onclick = () => close();
}