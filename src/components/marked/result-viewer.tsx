import { Component } from "react"
import { EditorView } from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import { json } from "@codemirror/lang-json"
import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language"

interface ResultViewerProps {
  value?: string
}

/**
 * ResultViewer
 *
 * Maintains an instance of CodeMirror 6 for viewing a GraphQL response.
 *
 * Props:
 *
 *   - value: The text of the editor.
 *
 */
export class ResultViewer extends Component<ResultViewerProps> {
  private view: EditorView | null = null
  private domNode: HTMLDivElement | null = null

  componentDidMount() {
    if (!this.domNode) return

    // Create read-only editor state for JSON results
    const state = EditorState.create({
      doc: this.props.value || "",
      extensions: [
        EditorState.readOnly.of(true),
        EditorView.editable.of(false),
        json(),
        syntaxHighlighting(defaultHighlightStyle),
        EditorView.theme({
          ".cm-editor": {
            fontSize: "inherit",
            fontFamily: "inherit",
          },
          ".cm-focused": {
            outline: "none",
          },
        }),
      ],
    })

    // Create editor view
    this.view = new EditorView({
      state,
      parent: this.domNode,
    })
  }

  componentWillUnmount() {
    if (this.view) {
      this.view.destroy()
      this.view = null
    }
  }

  shouldComponentUpdate(nextProps: ResultViewerProps) {
    return this.props.value !== nextProps.value
  }

  componentDidUpdate() {
    if (!this.view) return

    this.view.dispatch({
      changes: {
        from: 0,
        to: this.view.state.doc.length,
        insert: this.props.value || "",
      },
    })
  }

  render() {
    return (
      <div
        className="result-window"
        ref={e => {
          this.domNode = e
        }}
      >
        <span className="editor-name rounded-tr">Response</span>
      </div>
    )
  }
}
