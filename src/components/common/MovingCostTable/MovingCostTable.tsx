import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from '@heroui/react';

import MovingTotalPrice from './MovingTotalPrice';

import { getMovingTableLabels } from './utils';
import { MOVING_LIST_TABLE_KEYS_MAP } from './constans';

const createColumns = () => {
  const labels = getMovingTableLabels();

  const columns = Object.values(MOVING_LIST_TABLE_KEYS_MAP).map(key => ({
    key,
    label: labels[key],
  }));

  return columns;
};

const columns = createColumns();

interface IMovingCostTableProps {
  rows:
    | {
        key: string;
        type: string;
        measure: string;
        quantity: number | string;
        price: string;
        totalPrice: string;
        isLiftIssue: boolean;
      }[]
    | [];
}

const MovingCOstTable: React.FunctionComponent<IMovingCostTableProps> = ({
  rows,
}) => {
  return (
    <Table
      aria-label="Moving Cost Table"
      classNames={{
        th: 'text-xs md:text-sm xl:text-base p-1 md:p-3',
        td: 'text-xs md:text-sm xl:text-base p-1 md:p-3',
      }}
      bottomContent={<MovingTotalPrice />}
    >
      <TableHeader columns={columns}>
        {column => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {item => (
          <TableRow
            key={item.key}
            className={item.isLiftIssue ? 'bg-red-100' : ''}
          >
            {columnKey => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default MovingCOstTable;
