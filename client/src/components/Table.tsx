import React from 'react';

interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  renderRowActions?: (item: T) => React.ReactNode;
}

const Table = <T extends { _id?: string | number }>({ data, columns, renderRowActions }: TableProps<T>) => {
  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          {columns.map((column, index) => (
            <th key={index} scope="col" className="px-6 py-3">
              {column.header}
            </th>
          ))}
          {renderRowActions && <th scope="col" className="px-6 py-3">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
            {columns.map((column, index) => (
              <td key={index} className="px-6 py-4">
                {column.render(item)}
              </td>
            ))}
            {renderRowActions && (
              <td className="px-6 py-4">
                {renderRowActions(item)}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;