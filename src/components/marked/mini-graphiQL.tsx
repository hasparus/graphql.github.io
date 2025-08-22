/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component } from "react"

import { graphql, GraphQLSchema } from "graphql"

import { QueryEditor } from "./query-editor"
import { VariableEditor } from "./variable-editor"
import { ResultViewer } from "./result-viewer"
import { getVariableToType } from "./get-variable-to-type"

export type MiniGraphiQLProps = {
  schema: GraphQLSchema
  query: string
  variables: string
  rootValue?: any
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
        <ResultViewer value={this.state.response || undefined} />
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

      let resultToSerialize: any = result
      if (result.errors) {
        // Convert errors to serializable format
        const serializedErrors = result.errors.map(error => ({
          message: error.message,
          locations: error.locations,
          path: error.path
        }))
        // Replace errors with serialized version for JSON.stringify
        resultToSerialize = { ...result, errors: serializedErrors }
      }

      if (queryID === this._editorQueryID) {
        this.setState({ response: JSON.stringify(resultToSerialize, null, 2) })
      }
    } catch (error) {
      if (queryID === this._editorQueryID) {
        this.setState({ response: JSON.stringify(error, null, 2) })
      }
    }
  }

  _handleEditQuery(value: string) {
    this.setState({ query: value })
  }

  _handleEditVariables(value: string) {
    this.setState({ variables: value })
  }
}
