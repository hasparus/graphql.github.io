/**
 * Render a custom UI for CodeMirror's hint which includes additional info
 * about the type and description for the selected context.
 */
export function onHasCompletion(cm, data, onHintInformationRender) {
  const CodeMirror = require("codemirror")
  let wrapper
  let information

  // When a hint result is selected, we touch the UI.
  CodeMirror.on(data, "select", (ctx, el) => {
    // Only the first time (usually when the hint UI is first displayed)
    // do we create the wrapping node.
    if (!wrapper) {
      // Wrap the existing hint UI, so we have a place to put information.
      const hintsUl = el.parentNode
      const container = hintsUl.parentNode
      wrapper = document.createElement("div")
      container.appendChild(wrapper)

      // CodeMirror vertically inverts the hint UI if there is not enough
      // space below the cursor. Since this modified UI appends to the bottom
      // of CodeMirror's existing UI, it could cover the cursor. This adjusts
      // the positioning of the hint UI to accommodate.
      let top = hintsUl.style.top
      let bottom = ""
      const cursorTop = cm.cursorCoords().top
      if (parseInt(top, 10) < cursorTop) {
        top = ""
        bottom = window.innerHeight - cursorTop + 3 + "px"
      }

      // Style the wrapper, remove positioning from hints. Note that usage
      // of this option will need to specify CSS to remove some styles from
      // the existing hint UI.
      wrapper.className = "CodeMirror-hints-wrapper"
      wrapper.style.left = hintsUl.style.left
      wrapper.style.top = top
      wrapper.style.bottom = bottom
      hintsUl.style.left = ""
      hintsUl.style.top = ""

      // This "information" node will contain the additional info about the
      // highlighted typeahead option.
      information = document.createElement("div")
      information.className = "CodeMirror-hint-information"
      if (bottom) {
        wrapper.appendChild(information)
        wrapper.appendChild(hintsUl)
      } else {
        wrapper.appendChild(hintsUl)
        wrapper.appendChild(information)
      }

      // When CodeMirror attempts to remove the hint UI, we detect that it was
      // removed from our wrapper and in turn remove the wrapper from the
      // original container.
      let onRemoveFn
      const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
          // Check if the hintsUl element was removed
          if (mutation.removedNodes) {
            mutation.removedNodes.forEach(node => {
              if (node === hintsUl) {
                // Cleanup logic
                observer.disconnect() // Stop observing
                wrapper.parentNode.removeChild(wrapper)
                wrapper = null
                information = null
                onRemoveFn = null
              }
            })
          }
        }
      })

      // Start observing the wrapper for child node removals
      observer.observe(wrapper, { childList: true, subtree: false })
    }

    // Now that the UI has been set up, add info to information.
    const description = ctx.description
      ? marked(ctx.description, { smartypants: true })
      : "Self descriptive."
    const type = ctx.type
      ? '<span class="infoType">' + String(ctx.type) + "</span>"
      : ""

    information.innerHTML =
      '<div class="content">' +
      (description.slice(0, 3) === "<p>"
        ? "<p>" + type + description.slice(3)
        : type + description) +
      "</div>"

    // Additional rendering?
    if (onHintInformationRender) {
      onHintInformationRender(information)
    }
  })
}

