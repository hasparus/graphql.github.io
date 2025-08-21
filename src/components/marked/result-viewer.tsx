/**
 * ResultViewer
 *
 * Maintains an instance of CodeMirror for viewing a GraphQL response.
 *
 * Props:
 *
 *   - value: The text of the editor.
 *
 */
export class ResultViewer extends Component {
  componentDidMount() {
    // TODO: I don't think this does anything other than a static import in Next.js.
    // We should use a dynamic import function if we want codemirror loaded lazily.
    const CodeMirror = require("codemirror")
    require("codemirror-graphql/results/mode")

    this.viewer = CodeMirror(this.domNode, {
      value: this.props.value || "",
      viewportMargin: Infinity,
      readOnly: true,
      theme: "graphiql",
      mode: "graphql-results",
      keyMap: "sublime",
      extraKeys: {
        // Editor improvements
        "Ctrl-Left": "goSubwordLeft",
        "Ctrl-Right": "goSubwordRight",
        "Alt-Left": "goGroupLeft",
        "Alt-Right": "goGroupRight",
      },
    })
  }

  componentWillUnmount() {
    this.viewer = null
  }

  shouldComponentUpdate(nextProps) {
    return this.props.value !== nextProps.value
  }

  componentDidUpdate() {
    this.viewer.setValue(this.props.value || "")
  }

  render() {
    return (
      <div className="result-window" ref={e => (this.domNode = e)}>
        <span className="editor-name rounded-tr">Response</span>
      </div>
    )
  }
}
