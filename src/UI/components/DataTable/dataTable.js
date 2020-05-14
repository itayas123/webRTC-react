import React, { Component } from "react";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import "./dataTable.css";

class DataTable extends Component {
  render() {
    const { data, columns, defaultPageSize } = this.props;
    return (
      <ReactTable
        data={data}
        columns={columns}
        defaultPageSize={defaultPageSize || 5}
        className="-striped -highlight"
        filterable
        defaultFilterMethod={(filter, row) =>
          row[filter.id]
            ? row[filter.id]
                .toString()
                .toLowerCase()
                .includes(filter.value.toLowerCase())
            : false
        }
        {...this.props}
      />
    );
  }
}

export default DataTable;
