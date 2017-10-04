var isJobLink = element => {
  return element.className === '' &&
    element.children.length === 0 &&
    element.innerHTML !== "Qualifiers" &&
    element.innerHTML !== "Overview"
}

var getAllJobLinks = function() {
  // The semicolon at the end of javascript:void(0); is VERY important
  let links = document.querySelectorAll(`[href="javascript:void(0);"]`)
  links = Array.from(links);
  links = links.filter(isJobLink)
  return links
}

var NUCAREERS_LINK = 'https://nucareers.northeastern.edu/myAccount/co-op/jobs.htm'

var remove_on_click = function(element) {
  element.setAttribute('onclick', null)
  let new_element = element.cloneNode(true);
  element.parentNode.replaceChild(new_element, element);
}


var patchAllJobLinks = function(...arguments) {
  let jobs = getAllJobLinks()
  let on_clicks = []

  for(let job of jobs) {
    on_clicks.push(job.getAttribute('onclick'))
    remove_on_click(job)
  }

  jobs = getAllJobLinks()
  for(let i = 0; i<jobs.length; i++) {
    let job = jobs[i]
    let prevOnClick = on_clicks[i]
    job.onclick = event => {
      let w = window.open(NUCAREERS_LINK)
      w.onload = function() {
        var script = document.createElement('script');
        script.innerHTML = `${prevOnClick};onclick();`
        w.document.head.appendChild(script);
      }
    }
  }
}

patchAllJobLinks();

let MUTATION_OBSERVER = new MutationObserver(patchAllJobLinks)
let ALL_CHANGES = {
  childList:true,
  attributes: true,
  characterData: true,
  subtree: true
}

for(let e of document.getElementsByClassName("orbis-posting-actions")) {
  new MutationObserver(() => alert("Changed")).observe(e,
                            ALL_CHANGES)
}
