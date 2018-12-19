import {
  type ParsedSelector,
  SelectorType,
  type SingleSelector
} from "../types/Querying";
import type { Fiber } from "../types/Fiber";

export function isFiberMatchingSelector(
  fiber: Fiber,
  selector: SingleSelector
) {
  try {
    // A quick check for components
    if (
      isComponentSelector(selector) &&
      typeof fiber.type === "function" &&
      fiber.type.name === selector
    ) {
      return true;
    }

    const selectorParts = seperateElementParts(selector);

    return fiberMatchesAllParts(fiber, selectorParts);
  } catch (e) {
    console.log("Failed", e);
    return false;
  }
}

function fiberMatchesAllParts(
  fiber: Fiber,
  selectorParts: Array<ParsedSelector>
): boolean {
  // assume true until one doesnt match
  const isMatch = selectorParts.reduce((isMatch, selectorPart) => {
    if (isMatch === false) {
      return false;
    }

    switch (selectorPart.type) {
      case SelectorType.ELEMENT:
        return fiber.type === selectorPart.query;
      case SelectorType.CLASS:
        return fiber.pendingProps.className === selectorPart.query;
      case SelectorType.PROPS:
        return (
          fiber.pendingProps[selectorPart.query[0]] === selectorPart.query[1]
        );

      case SelectorType.PROPSKEY:
        return fiber.pendingProps.hasOwnProperty(selectorPart.query);
      default:
        throw new Error(
          `Selector type not yet supported: ${selectorPart.type}`
        );
    }
  }, true);

  return isMatch;
}

function seperateElementParts(selector): Array<ParsedSelector> {
  const selectorForElement = extractElement(selector);
  const selectorsForClasses = extractClasses(selector);
  const selectorsForProps = extractProps(selector);

  return [
    selectorForElement,
    ...selectorsForClasses,
    ...selectorsForProps
  ].filter(selector => !!selector);
}

function isComponentSelector(selector: SingleSelector): null | ParsedSelector {
  // Product !== product
  return {
    type: SelectorType.COMPONENT,
    query: selector[0].toLowerCase() !== selector[0]
  };
}

function extractElement(selector: SingleSelector): null | ParsedSelector {
  const element = /^[a-z]+/.exec(selector);
  return element ? { type: SelectorType.ELEMENT, query: element[0] } : null;
}

// Returns both PROPS and PROPSKEY type ParsedSelector
function extractProps(selector: SingleSelector): null | ParsedSelector {
  const hasSomeProps = /(\[.+\])/.exec(selector);

  if (hasSomeProps === null) {
    return [null];
  }

  // Changes [foo][bar] => ['[foo', 'bar]'];
  return hasSomeProps[0].split("][").map(messyPropSelector => {
    const cleanSelector = messyPropSelector.replace(/(\[|\])/g, "");

    const [key, value] = cleanSelector.split("=");

    if (!value) {
      return {
        type: SelectorType.PROPSKEY,
        query: key
      };
    }

    return {
      type: SelectorType.PROPS,
      query: [
        key,
        // value needs to be cleaned up from extra wrapping quotes
        value.replace(/('|")/g, "")
      ]
    };
  });
}

function extractClasses(selector: SingleSelector): null | ParsedSelector {
  return (
    selector
      .split(/(\.[a-zA-Z-]+)/)
      // This is sort of a filter/map where make sure we only inject strings that are class queries.
      .reduce((classes, className) => {
        if (className[0] === ".") {
          classes.push({
            type: SelectorType.CLASS,
            query: className.substring(1) // remove the `.` from the front
          });
        }

        return classes;
      }, [])
  );
}
