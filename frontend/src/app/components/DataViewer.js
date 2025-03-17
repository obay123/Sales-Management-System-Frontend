import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Panel } from "primereact/panel";


export default function DataViewer({ data, title = "Details", columns }) {
  if (!data) return <p className="text-gray-500">No data selected.</p>;

  return (
    <div className="p-4">
      {columns && (
        <DataTable value={[data]} className="mt-4">
          {columns.map((col) => (
            <Column key={col.field} field={col.field} header={col.header} />
          ))}
        </DataTable>
      )}
    </div>
  );
}
