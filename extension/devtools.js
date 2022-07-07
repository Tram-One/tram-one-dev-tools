// javascript for getting details about a tram-one element
const selectedElementExp = () => {
  // look for the tram-one element (either here, or up the tree)
  let elementAtCursor = $0;
  const isTramOneElement = () => elementAtCursor["tram-tag"];
  const isTramOneRoot = () => elementAtCursor.tagName === "TRAM-ONE";
  while (!isTramOneElement() && !isTramOneRoot() && elementAtCursor) {
    elementAtCursor = elementAtCursor.parentElement;
  }
  if (isTramOneRoot() || !elementAtCursor) {
    return { error: "could not find tram-one element" };
  }

  // once we've found the element, build an object with the element details

  // pull the stores associated with this element
  const tramOneStores = window["tram-space"]["tram-observable-store"];
  const selectedElementStoreKeys = elementAtCursor["tram-tag-store-keys"];
  const selectedElementStores = (selectedElementStoreKeys || []).map((key) =>
    JSON.parse(JSON.stringify(tramOneStores[key]))
  );

  // pull the global stores associated with this element
  const selectedElementGlobalStoreKeys =
    elementAtCursor["tram-tag-global-store-keys"];
  const selectedElementGlobalStores = (
    selectedElementGlobalStoreKeys || []
  ).map((key) => JSON.parse(JSON.stringify(tramOneStores[key])));

  // pull the events associated with this element
  const selectedElementEvents = elementAtCursor["events"] || [];
  const eventsAndFunctions = Object.create(null);
  selectedElementEvents.forEach((event) => {
    eventsAndFunctions[event] = elementAtCursor[event];
  });

  // create an empty object so we don't have [[prototype]]
  const result = Object.create(null);

  result.name = elementAtCursor["tram-tag-name"];
  result.props = elementAtCursor["tram-tag-props"];
  result.tag_children = elementAtCursor["tram-tag-children"];
  result.tag_events = eventsAndFunctions;
  result.tag_stores = selectedElementStores;
  result.tag_stores_global = selectedElementGlobalStores;

  return result;
};

// create sidebar pane for elements tab
chrome.devtools.panels.elements.createSidebarPane("Tram-One", (sidebarPane) => {
  chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
    sidebarPane.setExpression(
      `(${selectedElementExp.toString()})()`,
      "Selected Tram-One Element"
    );
  });
});
