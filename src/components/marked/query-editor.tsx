import { Component } from "react";

/**
 * QueryEditor
 *
 * Maintains an instance of CodeMirror responsible for editing a GraphQL query.
 *
 * Props:
 *
 *   - schema: A GraphQLSchema instance enabling editor linting and hinting.
 *   - value: The text of the editor.
 *   - onEdit: A function called when the editor changes, given the edited text.
 *
 */
export class QueryEditor extends Component {
  constructor(props) {
    super()

    // Keep a cached version of the value, this cache will be updated when the
    // editor is updated, which can later be used to protect the editor from
    // unnecessary updates during the update lifecycle.
    this.cachedValue = props.value || ""
  }

  /**
   * Public API for retrieving the CodeMirror instance from this
   * React component.
   */
  getCodeMirror() {
    return this.editor
  }

  componentDidMount() {
    const CodeMirror = require("codemirror")
    require("codemirror/addon/hint/show-hint")
    require("codemirror/addon/comment/comment")
    require("codemirror/addon/edit/matchbrackets")
    require("codemirror/addon/edit/closebrackets")
    require("codemirror/addon/lint/lint")
    require("codemirror/keymap/sublime")
    require("codemirror-graphql/hint")
    require("codemirror-graphql/lint")
    require("codemirror-graphql/mode")

    this.editor = CodeMirror(this.domNode, {
      value: this.props.value || "",
      viewportMargin: Infinity,
      tabSize: 2,
      mode: "graphql",
      theme: "graphiql", // <-- here?
      keyMap: "sublime",
      autoCloseBrackets: true,
      matchBrackets: true,
      showCursorWhenSelecting: true,
      lint: {
        schema: this.props.schema,
        onUpdateLinting: this._didLint.bind(this),
      },
      hintOptions: {
        schema: this.props.schema,
        closeOnUnfocus: true,
        completeSingle: false,
      },
      extraKeys: {
        "Cmd-Space": () => this.editor.showHint({ completeSingle: false }),
        "Ctrl-Space": () => this.editor.showHint({ completeSingle: false }),
        "Alt-Space": () => this.editor.showHint({ completeSingle: false }),
        "Shift-Space": () => this.editor.showHint({ completeSingle: false }),

        "Cmd-Enter": () => {
          if (this.props.onRunQuery) {
            this.props.onRunQuery()
          }
        },
        "Ctrl-Enter": () => {
          if (this.props.onRunQuery) {
            this.props.onRunQuery()
          }
        },

        // Editor improvements
        "Ctrl-Left": "goSubwordLeft",
        "Ctrl-Right": "goSubwordRight",
        "Alt-Left": "goGroupLeft",
        "Alt-Right": "goGroupRight",
      },
    })

    this.editor.on("change", this._onEdit.bind(this))
    this.editor.on("keyup", this._onKeyUp.bind(this))
    this.editor.on("hasCompletion", this._onHasCompletion.bind(this))
  }

  componentWillUnmount() {
    this.editor = null
  }

  componentDidUpdate(prevProps) {
    // Ensure the changes caused by this update are not interpreted as
    // user-input changes which could otherwise result in an infinite
    // event loop.
    this.ignoreChangeEvent = true
    if (this.props.schema !== prevProps.schema) {
      this.editor.options.lint.schema = this.props.schema
      this.editor.options.hintOptions.schema = this.props.schema
      CodeMirror.signal(this.editor, "change", this.editor)
    }
    if (
      this.props.value !== prevProps.value &&
      this.props.value !== this.cachedValue
    ) {
      this.cachedValue = this.props.value
      this.editor.setValue(this.props.value)
    }
    this.ignoreChangeEvent = false
  }

  _didLint(annotations) {
    if (annotations.length === 0) {
      this.props.runQuery()
    }
  }

  _onKeyUp(cm, event) {
    const code = event.keyCode
    if (
      (code >= 65 && code <= 90) || // letters
      (!event.shiftKey && code >= 48 && code <= 57) || // numbers
      (event.shiftKey && code === 189) || // underscore
      (event.shiftKey && code === 50) || // @
      (event.shiftKey && code === 57) // (
    ) {
      this.editor.execCommand("autocomplete")
    }
  }

  _onEdit() {
    if (!this.ignoreChangeEvent) {
      this.cachedValue = this.editor.getValue()
      if (this.props.onEdit) {
        this.props.onEdit(this.cachedValue)
      }
    }
  }

  _onHasCompletion(cm, data) {
    onHasCompletion(cm, data, this.props.onHintInformationRender)
  }

  render() {
    return (
      <div className="query-editor" ref={e => (this.domNode = e)}>
        <span className="editor-name rounded-tl">Operation</span>
      </div>
    )
  }
}
