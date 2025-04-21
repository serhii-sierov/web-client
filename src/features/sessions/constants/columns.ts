'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Session } from '../types';

export const columns: ColumnDef<Session>[] = [
  {
    accessorKey: 'sessionId',
    header: 'Session ID',
  },
  {
    accessorKey: 'device',
    header: 'Device',
  },
  {
    accessorKey: 'ipAddress',
    header: 'IP Address',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
  {
    accessorKey: 'expiresAt',
    header: 'Expires At',
  },
  {
    accessorKey: 'identity',
    header: 'Identity',
    cell: ({ row }) => {
      return row.original.identity.provider;
    },
  },
];
