/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component } from "react"
import { marked } from "marked"

import { graphql, formatError, GraphQLSchema } from "graphql"

import { QueryEditor } from "./query-editor"

export type MiniGraphiQLProps = {
  schema: GraphQLSchema
  query: string
  variables: string
}

interface MiniGraphiQLState {
  query: string
  variables: string
  response: string | null
  variableToType: Record<string, string>
}

export default class MiniGraphiQL extends Component<
  MiniGraphiQLProps,
  MiniGraphiQLState
> {
  // Lifecycle

  _editorQueryID = 0

  constructor(props: MiniGraphiQLProps) {
    super(props)
    const query = props.query.replace(/^\s+/, "")

    // Initialize state
    this.state = {
      query: query,
      variables: props.variables,
      response: null,
      variableToType: getVariableToType(props.schema, query),
    }
  }

  render() {
    const editor = (
      <QueryEditor
        key="query-editor"
        schema={this.props.schema}
        value={this.state.query}
        onEdit={this._handleEditQuery.bind(this)}
        runQuery={this._runQueryFromEditor.bind(this)}
      />
    )

    return (
      <div className="miniGraphiQL">
        {Object.keys(this.state.variableToType).length > 0 ? (
          <div className="hasVariables">
            {editor}
            <VariableEditor
              value={this.state.variables}
              variableToType={this.state.variableToType}
              onEdit={this._handleEditVariables.bind(this)}
              onRunQuery={this._runQuery.bind(this)}
            />
          </div>
        ) : (
          editor
        )}
        <ResultViewer value={this.state.response} />
      </div>
    )
  }

  componentDidMount() {
    this._runQueryFromEditor()
  }

  // Private methods

  _runQueryFromEditor() {
    this.setState({
      variableToType: getVariableToType(this.props.schema, this.state.query),
    })
    this._runQuery()
  }

  async _runQuery() {
    this._editorQueryID++
    const queryID = this._editorQueryID
    try {
      const result = await graphql({
        schema: this.props.schema,
        source: this.state.query,
        variableValues: JSON.parse(this.state.variables || "{}"),
        rootValue: this.props.rootValue,
      })

      if (result.errors) {
        result.errors = result.errors.map(formatError)
      }

      if (queryID === this._editorQueryID) {
        this.setState({ response: JSON.stringify(result, null, 2) })
      }
    } catch (error) {
      if (queryID === this._editorQueryID) {
        this.setState({ response: JSON.stringify(error, null, 2) })
      }
    }
  }

  _handleEditQuery(value) {
    this.setState({ query: value })
  }

  _handleEditVariables(value) {
    this.setState({ variables: value })
  }
}
