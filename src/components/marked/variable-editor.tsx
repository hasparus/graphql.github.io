import type CodeMirror from "codemirror";
import { Component } from "react"
import { onHasCompletion } from "./on-has-completion";

interface VariableEditorProps {
  value: string;
}

/**
 * VariableEditor
 *
 * An instance of CodeMirror for editing variables defined in QueryEditor.
 *
 * Props:
 *
 *   - variableToType: A mapping of variable name to GraphQLType.
 *   - value: The text of the editor.
 *   - onEdit: A function called when the editor changes, given the edited text.
 *
 */
export class VariableEditor extends Component<VariableEditorProps> {
  cachedValue: string

  _onKeyUp: (cm: CodeMirror.DocOrEditor, event: any) => void
  _onEdit: () => void
  _onHasCompletion: (cm: CodeMirror.DocOrEditor, event: any) => void

  constructor(props: VariableEditorProps) {
    super(props);

    // Keep a cached version of the value, this cache will be updated when the
    // editor is updated, which can later be used to protect the editor from
    // unnecessary updates during the update lifecycle.
    this.cachedValue = props.value || ""
    this._onKeyUp = this.onKeyUp.bind(this)
    this._onEdit = this.onEdit.bind(this)
    this._onHasCompletion = this.onHasCompletion.bind(this)
  }

  componentDidMount() {
    // Lazily require to ensure requiring GraphiQL outside of a Browser context
    // does not produce an error.
    const CodeMirror = require("codemirror")
    require("codemirror/addon/hint/show-hint")
    require("codemirror/addon/edit/matchbrackets")
    require("codemirror/addon/edit/closebrackets")
    require("codemirror/addon/lint/lint")
    require("codemirror/keymap/sublime")
    require("codemirror-graphql/variables/hint")
    require("codemirror-graphql/variables/lint")
    require("codemirror-graphql/variables/mode")

    this.editor = CodeMirror(this.domNode, {
      value: this.props.value || "",
      viewportMargin: Infinity,
      tabSize: 2,
      mode: "graphql-variables",
      theme: "graphiql",
      keyMap: "sublime",
      autoCloseBrackets: true,
      matchBrackets: true,
      showCursorWhenSelecting: true,
      lint: {
        variableToType: this.props.variableToType,
        onUpdateLinting: this._didLint.bind(this),
      },
      hintOptions: {
        variableToType: this.props.variableToType,
      },
      extraKeys: {
        "Cmd-Space": () => this.editor.showHint({ completeSingle: false }),
        "Ctrl-Space": () => this.editor.showHint({ completeSingle: false }),
        "Alt-Space": () => this.editor.showHint({ completeSingle: false }),
        "Shift-Space": () => this.editor.showHint({ completeSingle: false }),

        "Cmd-Enter"() {
          if (this.props.onRunQuery) {
            this.props.onRunQuery()
          }
        },
        "Ctrl-Enter"() {
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

    this.editor.on("change", this._onEdit)
    this.editor.on("keyup", this._onKeyUp)
    this.editor.on("hasCompletion", this._onHasCompletion)
  }

  componentDidUpdate(prevProps) {
    const CodeMirror = require("codemirror")

    // Ensure the changes caused by this update are not interpreted as
    // user-input changes which could otherwise result in an infinite
    // event loop.
    this.ignoreChangeEvent = true
    if (this.props.variableToType !== prevProps.variableToType) {
      this.editor.options.lint.variableToType = this.props.variableToType
      this.editor.options.hintOptions.variableToType = this.props.variableToType
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

  componentWillUnmount() {
    this.editor.off("change", this._onEdit)
    this.editor.off("keyup", this._onKeyUp)
    this.editor.off("hasCompletion", this._onHasCompletion)
    this.editor = null
  }

  render() {
    return (
      <div className="variable-editor" ref={e => (this.domNode = e)}>
        <span className="editor-name">Variables</span>
      </div>
    )
  }

  _didLint(annotations) {
    if (annotations.length === 0) {
      this.props.onRunQuery()
    }
  }

  onKeyUp(cm, event) {
    const code = event.keyCode
    if (
      (code >= 65 && code <= 90) || // letters
      (!event.shiftKey && code >= 48 && code <= 57) || // numbers
      (event.shiftKey && code === 189) || // underscore
      (event.shiftKey && code === 222) // "
    ) {
      this.editor.execCommand("autocomplete")
    }
  }

  onEdit() {
    if (!this.ignoreChangeEvent) {
      this.cachedValue = this.editor.getValue()
      if (this.props.onEdit) {
        this.props.onEdit(this.cachedValue)
      }
    }
  }

  onHasCompletion(cm, data) {
    onHasCompletion(cm, data, this.props.onHintInformationRender)
  }
}
