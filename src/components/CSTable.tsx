interface CSTableProps {
  headers: string[];
  rows: string[][];
}

export default function CSTable({ headers, rows }: CSTableProps) {
  return (
    <div className="cs-table-wrapper">
      <table className="cs-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="cs-table-header">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="cs-table-row">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="cs-table-cell">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
